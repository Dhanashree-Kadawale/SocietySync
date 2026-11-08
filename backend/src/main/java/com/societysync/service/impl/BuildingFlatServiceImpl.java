package com.societysync.service.impl;

import com.societysync.dto.BuildingDto;
import com.societysync.dto.FlatDto;
import com.societysync.entity.Building;
import com.societysync.entity.Flat;
import com.societysync.entity.Society;
import com.societysync.exception.ResourceNotFoundException;
import com.societysync.repository.BuildingRepository;
import com.societysync.repository.FlatRepository;
import com.societysync.repository.SocietyRepository;
import com.societysync.service.BuildingFlatService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BuildingFlatServiceImpl implements BuildingFlatService {

    private final BuildingRepository buildingRepository;
    private final FlatRepository flatRepository;
    private final SocietyRepository societyRepository;

    public BuildingFlatServiceImpl(BuildingRepository buildingRepository,
                                  FlatRepository flatRepository,
                                  SocietyRepository societyRepository) {
        this.buildingRepository = buildingRepository;
        this.flatRepository = flatRepository;
        this.societyRepository = societyRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<BuildingDto> getBuildings(Long societyId) {
        List<Building> list = (societyId != null)
                ? buildingRepository.findBySocietyId(societyId)
                : buildingRepository.findAll();
        return list.stream().map(this::toBuildingDto).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public BuildingDto createBuilding(BuildingDto dto) {
        Society society = resolveSociety(dto.getSocietyId());
        Building b = new Building();
        b.setSociety(society);
        b.setName(dto.getName());
        b.setTotalFloors(dto.getTotalFloors() != null ? dto.getTotalFloors() : 1);
        return toBuildingDto(buildingRepository.save(b));
    }

    @Override
    @Transactional
    public void deleteBuilding(Long id) {
        if (!buildingRepository.existsById(id)) {
            throw new ResourceNotFoundException("Building not found: " + id);
        }
        buildingRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<FlatDto> getFlats(Long societyId, Long buildingId) {
        List<Flat> list;
        if (societyId != null && buildingId != null) {
            list = flatRepository.findBySocietyIdAndBuildingId(societyId, buildingId);
        } else if (buildingId != null) {
            list = flatRepository.findByBuildingId(buildingId);
        } else if (societyId != null) {
            list = flatRepository.findBySocietyId(societyId);
        } else {
            list = flatRepository.findAll();
        }
        return list.stream().map(this::toFlatDto).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public FlatDto getFlatById(Long id) {
        Flat flat = flatRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Flat not found: " + id));
        return toFlatDto(flat);
    }

    @Override
    @Transactional
    public FlatDto createFlat(FlatDto dto) {
        Society society = resolveSociety(dto.getSocietyId());
        Building building = null;
        if (dto.getBuildingId() != null) {
            building = buildingRepository.findById(dto.getBuildingId())
                    .orElseThrow(() -> new ResourceNotFoundException("Building not found: " + dto.getBuildingId()));
        } else if (dto.getBuildingName() != null && !dto.getBuildingName().trim().isEmpty()) {
            final String bName = dto.getBuildingName().trim();
            building = buildingRepository.findBySocietyId(society.getId()).stream()
                    .filter(b -> b.getName() != null && b.getName().equalsIgnoreCase(bName))
                    .findFirst()
                    .orElseGet(() -> {
                        Building nb = new Building();
                        nb.setSociety(society);
                        nb.setName(bName);
                        nb.setTotalFloors(10);
                        return buildingRepository.save(nb);
                    });
        } else {
            List<Building> buildings = buildingRepository.findBySocietyId(society.getId());
            if (!buildings.isEmpty()) {
                building = buildings.get(0);
            } else {
                Building nb = new Building();
                nb.setSociety(society);
                nb.setName("Wing A");
                building = buildingRepository.save(nb);
            }
        }

        Flat f = new Flat();
        f.setSociety(society);
        f.setBuilding(building);
        f.setFlatNumber(dto.getFlatNumber());
        f.setFloorNumber(dto.getFloorNumber() != null ? dto.getFloorNumber() : 1);
        f.setBhkType(dto.getBhkType() != null ? dto.getBhkType() : "2BHK");
        f.setCarpetAreaSqft(dto.getCarpetAreaSqft() != null ? dto.getCarpetAreaSqft() : BigDecimal.valueOf(950));
        f.setParkingSlot(dto.getParkingSlot());
        f.setIntercomNumber(dto.getIntercomNumber());
        f.setStatus(dto.getStatus() != null ? dto.getStatus() : "OCCUPIED");
        f.setOwnerName(dto.getOwnerName());
        f.setOwnerPhone(dto.getOwnerPhone());

        return toFlatDto(flatRepository.save(f));
    }

    @Override
    @Transactional
    public FlatDto updateFlat(Long id, FlatDto dto) {
        Flat f = flatRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Flat not found: " + id));

        if (dto.getFlatNumber() != null) f.setFlatNumber(dto.getFlatNumber());
        if (dto.getFloorNumber() != null) f.setFloorNumber(dto.getFloorNumber());
        if (dto.getBhkType() != null) f.setBhkType(dto.getBhkType());
        if (dto.getCarpetAreaSqft() != null) f.setCarpetAreaSqft(dto.getCarpetAreaSqft());
        if (dto.getParkingSlot() != null) f.setParkingSlot(dto.getParkingSlot());
        if (dto.getIntercomNumber() != null) f.setIntercomNumber(dto.getIntercomNumber());
        if (dto.getStatus() != null) f.setStatus(dto.getStatus());
        if (dto.getOwnerName() != null) f.setOwnerName(dto.getOwnerName());
        if (dto.getOwnerPhone() != null) f.setOwnerPhone(dto.getOwnerPhone());
        f.setUpdatedAt(LocalDateTime.now());

        return toFlatDto(flatRepository.save(f));
    }

    @Override
    @Transactional
    public void deleteFlat(Long id) {
        if (!flatRepository.existsById(id)) {
            throw new ResourceNotFoundException("Flat not found: " + id);
        }
        flatRepository.deleteById(id);
    }

    private Society resolveSociety(Long societyId) {
        if (societyId != null) {
            return societyRepository.findById(societyId)
                    .orElseThrow(() -> new ResourceNotFoundException("Society not found: " + societyId));
        }
        return societyRepository.findAll().stream().findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("No society configured"));
    }

    private BuildingDto toBuildingDto(Building b) {
        BuildingDto d = new BuildingDto();
        d.setId(b.getId());
        if (b.getSociety() != null) d.setSocietyId(b.getSociety().getId());
        d.setName(b.getName());
        d.setTotalFloors(b.getTotalFloors());
        d.setTotalFlats(flatRepository.countByBuildingId(b.getId()));
        return d;
    }

    private FlatDto toFlatDto(Flat f) {
        FlatDto d = new FlatDto();
        d.setId(f.getId());
        if (f.getSociety() != null) d.setSocietyId(f.getSociety().getId());
        if (f.getBuilding() != null) {
            d.setBuildingId(f.getBuilding().getId());
            d.setBuildingName(f.getBuilding().getName());
        }
        d.setFlatNumber(f.getFlatNumber());
        d.setFloorNumber(f.getFloorNumber());
        d.setBhkType(f.getBhkType());
        d.setCarpetAreaSqft(f.getCarpetAreaSqft());
        d.setParkingSlot(f.getParkingSlot());
        d.setIntercomNumber(f.getIntercomNumber());
        d.setStatus(f.getStatus());
        d.setOwnerName(f.getOwnerName());
        d.setOwnerPhone(f.getOwnerPhone());
        return d;
    }
}

