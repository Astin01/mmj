// //검색 옵션 객체
let searchOption;

// 장소 검색 객체
let ps = new kakao.maps.services.Places();

// 커스텀 오버레이
let customOverlay = new kakao.maps.CustomOverlay(null);
let triOverlay = new kakao.maps.CustomOverlay(null);
// 마커를 담을 배열
let markers = [];
//지도 컨테이너
let mapContainer = document.getElementById("map"),
  mapOption = {
    center: new kakao.maps.LatLng(33.450701, 126.570667),
    level: 3, // 지도의 확대 레벨
  };

// 지도 생성
let map = new kakao.maps.Map(mapContainer, mapOption);
