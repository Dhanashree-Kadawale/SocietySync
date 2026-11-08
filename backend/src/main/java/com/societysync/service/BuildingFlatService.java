package com.societysync.service;

import com.societysync.dto.BuildingDto;
import com.societysync.dto.FlatDto;

import java.util.List;

public interface BuildingFlatService {
    List<BuildingDto> getBuildings(Long societyId);
    BuildingDto createBuilding(BuildingDto dto);
    void deleteBuilding(Long id);

    List<FlatDto> getFlats(Long societyId, Long buildingId);
    FlatDto getFlatById(Long id);
    FlatDto createFlat(FlatDto dto);
    FlatDto updateFlat(Long id, FlatDto dto);
    void deleteFlat(Long id);
}

