$baseUrl = "http://localhost:8080/api"
$results = @()

function Test-Endpoint($name, $script) {
    try {
        $res = & $script
        Write-Host "[PASS] $name" -ForegroundColor Green
        return [PSCustomObject]@{ Test = $name; Status = "PASS"; Details = ($res | Out-String).Trim() }
    } catch {
        Write-Host "[FAIL] $name - $_" -ForegroundColor Red
        return [PSCustomObject]@{ Test = $name; Status = "FAIL"; Details = $_.Exception.Message }
    }
}

# 1. Logins for all 4 roles
$results += Test-Endpoint "Super Admin Login" {
    $body = @{ identity = "superadmin@societysync.com"; password = "SuperAdmin@2026" } | ConvertTo-Json
    Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $body -ContentType "application/json"
}

$results += Test-Endpoint "Secretary Admin Login" {
    $body = @{ identity = "secretary@greenwood.com"; password = "Secretary@2026" } | ConvertTo-Json
    Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $body -ContentType "application/json"
}

$results += Test-Endpoint "Resident Login" {
    $body = @{ identity = "priya.sharma@greenwood.com"; password = "Resident@2026" } | ConvertTo-Json
    Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $body -ContentType "application/json"
}

$results += Test-Endpoint "Maintenance Staff Login" {
    $body = @{ identity = "maintenance.lead@greenwood.com"; password = "Staff@2026" } | ConvertTo-Json
    Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $body -ContentType "application/json"
}

# 2. Dynamic Registration of New Resident
$rand = Get-Random -Minimum 1000 -Maximum 9999
$newEmail = "live.user.$rand@example.com"
$results += Test-Endpoint "Register New Resident ($newEmail)" {
    $regBody = @{
        name = "Live Test Resident $rand"
        email = $newEmail
        phone = "+91 99999 $rand"
        password = "User@2026"
        role = "RESIDENT"
        flatNumber = "C-$rand"
        registrationNumber = "REG-$rand"
    } | ConvertTo-Json
    Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method Post -Body $regBody -ContentType "application/json"
}

# 3. Login with newly registered user
$results += Test-Endpoint "Login with Newly Registered User" {
    $loginBody = @{ identity = $newEmail; password = "User@2026" } | ConvertTo-Json
    Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
}

# 4. Flats CRUD
$results += Test-Endpoint "POST /flats (Create Flat)" {
    $flatBody = @{
        flatNumber = "D-50$rand"
        buildingName = "Block D"
        floorNumber = 5
        bhkType = "3BHK"
        carpetAreaSqft = 1350
        status = "OCCUPIED"
        ownerName = "New Owner $rand"
        ownerPhone = "+91 98888 12345"
    } | ConvertTo-Json
    $created = Invoke-RestMethod -Uri "$baseUrl/flats" -Method Post -Body $flatBody -ContentType "application/json"
    $script:flatId = $created.data.id
    $created
}

$results += Test-Endpoint "PUT /flats/$script:flatId (Update Flat)" {
    $updateBody = @{ status = "VACANT" } | ConvertTo-Json
    Invoke-RestMethod -Uri "$baseUrl/flats/$script:flatId" -Method Put -Body $updateBody -ContentType "application/json"
}

$results += Test-Endpoint "DELETE /flats/$script:flatId (Delete Flat)" {
    Invoke-RestMethod -Uri "$baseUrl/flats/$script:flatId" -Method Delete
}

# 5. Documents CRUD
$results += Test-Endpoint "POST /documents (Create Document)" {
    $docBody = @{
        title = "Fire Safety Audit $rand"
        category = "SAFETY"
        fileType = "PDF"
        fileSize = "2.1 MB"
        description = "Mandatory safety verification document"
    } | ConvertTo-Json
    $created = Invoke-RestMethod -Uri "$baseUrl/documents" -Method Post -Body $docBody -ContentType "application/json"
    $script:docId = $created.data.id
    $created
}

$results += Test-Endpoint "DELETE /documents/$script:docId (Delete Document)" {
    Invoke-RestMethod -Uri "$baseUrl/documents/$script:docId" -Method Delete
}

# 6. Expenses CRUD
$results += Test-Endpoint "POST /expenses (Create Expense)" {
    $expBody = @{
        title = "Lift Motor Servicing $rand"
        category = "Maintenance"
        amount = 12500
        vendorName = "Otis Elevators"
        status = "PENDING"
    } | ConvertTo-Json
    $created = Invoke-RestMethod -Uri "$baseUrl/expenses" -Method Post -Body $expBody -ContentType "application/json"
    $script:expId = $created.data.id
    $created
}

$results += Test-Endpoint "PUT /expenses/$script:expId/status (Approve Expense)" {
    $statBody = @{ status = "APPROVED" } | ConvertTo-Json
    Invoke-RestMethod -Uri "$baseUrl/expenses/$script:expId/status" -Method Put -Body $statBody -ContentType "application/json"
}

$results += Test-Endpoint "DELETE /expenses/$script:expId (Delete Expense)" {
    Invoke-RestMethod -Uri "$baseUrl/expenses/$script:expId" -Method Delete
}

# 7. Facility & Booking CRUD
$results += Test-Endpoint "POST /bookings (Book Facility)" {
    $bkgBody = @{
        facilityName = "Community Clubhouse"
        residentName = "Priya Sharma"
        flatNumber = "A-204"
        bookingDate = "2026-10-28"
        startTime = "18:00"
        endTime = "21:00"
        guestsCount = 20
        bookingFee = 1500
        purpose = "Anniversary celebration"
    } | ConvertTo-Json
    $created = Invoke-RestMethod -Uri "$baseUrl/bookings" -Method Post -Body $bkgBody -ContentType "application/json"
    $script:bkgId = $created.data.id
    $created
}

$results += Test-Endpoint "PUT /bookings/$script:bkgId/status (Confirm Booking)" {
    $statBody = @{ status = "CONFIRMED" } | ConvertTo-Json
    Invoke-RestMethod -Uri "$baseUrl/bookings/$script:bkgId/status" -Method Put -Body $statBody -ContentType "application/json"
}

# 8. Visitors CRUD
$results += Test-Endpoint "POST /visitors (Register Visitor)" {
    $visBody = @{
        name = "Courier Agent $rand"
        phone = "+91 97777 $rand"
        flatNumber = "A-204"
        hostResidentName = "Priya Sharma"
        purpose = "Delivery"
        status = "CHECKED_IN"
    } | ConvertTo-Json
    $created = Invoke-RestMethod -Uri "$baseUrl/visitors" -Method Post -Body $visBody -ContentType "application/json"
    $script:visId = $created.data.id
    $created
}

$results += Test-Endpoint "PUT /visitors/$script:visId/status (Checkout Visitor)" {
    $statBody = @{ status = "CHECKED_OUT" } | ConvertTo-Json
    Invoke-RestMethod -Uri "$baseUrl/visitors/$script:visId/status" -Method Put -Body $statBody -ContentType "application/json"
}

# 9. Complaints CRUD
$results += Test-Endpoint "POST /complaints (Create Complaint)" {
    $cmpBody = @{
        title = "AC line voltage drop $rand"
        category = "Electrical"
        priority = "HIGH"
        status = "OPEN"
        flatNumber = "A-204"
        residentName = "Priya Sharma"
        description = "Voltage fluctuating rapidly in living room"
    } | ConvertTo-Json
    $created = Invoke-RestMethod -Uri "$baseUrl/complaints" -Method Post -Body $cmpBody -ContentType "application/json"
    $script:cmpId = $created.data.id
    $created
}

$results += Test-Endpoint "PUT /complaints/$script:cmpId (Resolve Complaint)" {
    $cmpUpdate = @{
        status = "RESOLVED"
        resolutionNotes = "Re-seated phase wire in junction box"
    } | ConvertTo-Json
    Invoke-RestMethod -Uri "$baseUrl/complaints/$script:cmpId" -Method Put -Body $cmpUpdate -ContentType "application/json"
}

# 10. Bills & Payments
$results += Test-Endpoint "POST /bills (Create Bill)" {
    $billBody = @{
        billNumber = "BILL-TEST-$rand"
        billingMonth = "November"
        billingYear = 2026
        flatNumber = "A-204"
        totalAmount = 4500
        status = "PENDING"
        dueDate = "2026-11-25"
    } | ConvertTo-Json
    $created = Invoke-RestMethod -Uri "$baseUrl/bills" -Method Post -Body $billBody -ContentType "application/json"
    $script:billId = $created.data.id
    $created
}

$results += Test-Endpoint "POST /bills/$script:billId/pay (Pay Bill)" {
    $payBody = @{
        paymentMethod = "UPI"
        transactionId = "TXN-TEST-$rand"
    } | ConvertTo-Json
    Invoke-RestMethod -Uri "$baseUrl/bills/$script:billId/pay" -Method Post -Body $payBody -ContentType "application/json"
}

Write-Host "`n=================== SUMMARY ===================" -ForegroundColor Cyan
$results | Format-Table -Property Test, Status
