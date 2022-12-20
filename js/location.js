//위치 정보 반환
function success({ coords }) {
  mylat = coords.latitude; // 위도
  mylon = coords.longitude; // 경도
  mypos = new kakao.maps.LatLng(mylat, mylon);

  map.setCenter(mypos);
  //검색 옵션 객체 생성
  searchOption = {
    location: mypos,
    radius: 10000,
  };
}

//위치 정보 요청 처리
function getUserLocation() {
  if (!navigator.geolocation) {
    throw "위치 정보가 지원되지 않습니다.";
  }
  pos = navigator.geolocation.getCurrentPosition(success);
}

//위치 정보 요청
getUserLocation();
