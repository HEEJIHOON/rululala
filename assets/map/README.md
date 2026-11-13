# 장소 스냅샷 (assets/map/pois.json, 도시 슬러그별 묶음)

- 내용: 도시별 맛집·관광지·숙소 핀 데이터. 각 항목은 {lat, lon, tags:{name, amenity?, tourism?, cuisine?}}.
- 출처: OpenStreetMap (© OpenStreetMap 기여자, ODbL https://opendatacommons.org/licenses/odbl/), Overpass API로 조회.
- 생성일: 2026-11-13. 실시간 데이터가 아니라서 실제와 달라졌을 수 있어요.
- 갱신: 필요할 때 스크립트로 다시 조회해 이 파일들을 교체해요 (자동 갱신 없음).
- 커버리지: 30개 도시. 사이트의 전체 도시 목록(data.js REGIONS)보다 적을 수 있어요. 스냅샷이 없는 도시는 페이지가 실시간 조회로 대체해요.
