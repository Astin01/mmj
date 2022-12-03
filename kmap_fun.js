//내 위치 정보
let mylat, mylon;
let mypos;
//개발자 추천 메뉴
let restaurant = {
  한식: [
    "사나이뚝배기",
    "소문날라",
    "홍가부대찌개",
    "이정림수제햄부대찌개",
    "김치만선생",
    "청교옥",
    "황태칼국수왕돈가스",
    "아이엠돈까스",
    "내찜닭",
    "소문날라",
    "공릉순두부",
    "광주한양식당",
    "더진국",
    "무봉리토종순대국",
    "공릉우동집",
    "소문난기사식당",
    "마인하우스",
    "수돈재",
    "굴다리전주",
    "밥은",
    "온달네",
    "숲속왕돈까스",
    "비젼식당",
    "원조강영숙봉평메밀촌",
  ],
  양식: [
    "핏짜굽는언니",
    "리틀파스타",
    "오늘의파스타",
    "오렌지몽키파스타",
    "피자마루 ",
    "피자스쿨 ",
    "맛닭꼬",
    "호치킨",
    "버거투버거",
    "플렉스",
    "루이스버거",
    "서오롱피자",
    "오븐에빠진닭",
  ],
  일식: [
    "기린",
    "스시쟁이",
    "도쿄식탁",
    "네코정",
    "개기일식",
    "경성초밥",
    "로지스시",
  ],
  분식: ["동대문엽기떡볶이", "쪼매", "멍텅구리"],
  고기집: ["세겹", "궁안뜰", "찬이네곱창", "화로상회", "서울껍데기"],
  중식: ["왕짜장", "뽕신"],
};

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
    category_group_code: "FD6",
    sort: kakao.maps.services.SortBy.ACCURACY,
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
// //검색 옵션 객체
let searchOption;

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

// 장소 검색 객체
let ps = new kakao.maps.services.Places();

// 커스텀 오버레이
let customOverlay = new kakao.maps.CustomOverlay(null);
let triOverlay = new kakao.maps.CustomOverlay(null);
//랜덤 맛집 요청
function ranPlace(event) {
  let keyword;
  let id = event.target.id;
  btn_ko.style.backgroundColor = "#ffa356";
  btn_jp.style.backgroundColor = "#ffa356";
  btn_ch.style.backgroundColor = "#ffa356";
  btn_eu.style.backgroundColor = "#ffa356";
  btn_meat.style.backgroundColor = "#ffa356";
  btn_ttk.style.backgroundColor = "#ffa356";
  document.getElementById(id).style.backgroundColor = "#d86200";
  switch (id) {
    case "btn_ko":
      keyword =
        restaurant.한식[Math.floor(Math.random() * restaurant.한식.length)];
      break;
    case "btn_jp":
      keyword =
        restaurant.일식[Math.floor(Math.random() * restaurant.일식.length)];
      break;
    case "btn_ch":
      keyword =
        restaurant.중식[Math.floor(Math.random() * restaurant.중식.length)];
      break;
    case "btn_eu":
      keyword =
        restaurant.양식[Math.floor(Math.random() * restaurant.양식.length)];
      break;
    case "btn_ttk":
      keyword =
        restaurant.분식[Math.floor(Math.random() * restaurant.분식.length)];
      break;
    case "btn_meat":
      keyword =
        restaurant.고기집[Math.floor(Math.random() * restaurant.고기집.length)];
      break;
  }
  keyword += "공릉";
  ps.keywordSearch(keyword, placesSearchRD, searchOption);
}
//랜덤 맛집 콜백
function placesSearchRD(data, status, pagination) {
  if (status === kakao.maps.services.Status.OK) {
    // 정상적으로 검색이 완료됐으면
    // 검색 목록과 마커를 표출합니다
    displayRdPlaces(data);
  } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
    alert("검색 결과가 존재하지 않습니다.");
    return;
  } else if (status === kakao.maps.services.Status.ERROR) {
    alert("검색 결과 중 오류가 발생했습니다.");
    return;
  }
}
function displayRdPlaces(places) {
  let listEl = document.getElementById("placesList"),
    menuEl = document.getElementById("menu_wrap"),
    fragment = document.createDocumentFragment(),
    bounds = new kakao.maps.LatLngBounds(),
    listStr = "",
    paginationEl = document.getElementById("pagination");

  customOverlay.setMap(null);
  triOverlay.setMap(null);

  while (paginationEl.hasChildNodes()) {
    paginationEl.removeChild(paginationEl.lastChild);
  }

  // 검색 결과 목록에 추가된 항목들을 제거합니다
  removeAllChildNods(listEl);

  // 지도에 표시되고 있는 마커를 제거합니다
  removeMarker();

  for (let i = 0; i < 1; i++) {
    // 마커를 생성하고 지도에 표시합니다
    let placePosition = new kakao.maps.LatLng(places[i].y, places[i].x),
      marker = addMarker(placePosition, i),
      itemEl = getListItem(i, places[i]); // 검색 결과 항목 Element를 생성합니다

    // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
    // LatLngBounds 객체에 좌표를 추가합니다

    bounds.extend(placePosition);

    // 마커와 검색결과 항목에 mouseover 했을때
    // 해당 장소에 인포윈도우에 장소명을 표시합니다
    // mouseout 했을 때는 인포윈도우를 닫습니다
    //click시에 인포윈도우를 엽니다
    (function (marker, title, places, map) {
      kakao.maps.event.addListener(marker, "click", function () {
        closeOverlay();
        displayCustomOverlay(marker, title, places);
      });

      itemEl.onmouseover = function () {
        displayCustomOverlay(marker, title, places);
      };

      itemEl.onmouseout = function () {
        closeOverlay();
      };
    })(marker, places[i].place_name, places[i], map, placePosition);

    fragment.appendChild(itemEl);
  }

  // 검색결과 항목들을 검색결과 목록 Element에 추가합니다
  listEl.appendChild(fragment);
  menuEl.scrollTop = 0;

  // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
  map.setBounds(bounds);
}

// 키워드 검색을 요청하는 함수입니다
function searchPlaces() {
  let keyword = document.getElementById("keyword").value;

  if (!keyword.replace(/^\s+|\s+$/g, "")) {
    return false;
  }

  // 장소검색 객체를 통해 키워드로 장소검색을 요청합니다
  ps.keywordSearch(keyword, placesSearchCB, searchOption);
}

// 장소검색이 완료됐을 때 호출되는 콜백함수 입니다
function placesSearchCB(data, status, pagination) {
  if (status === kakao.maps.services.Status.OK) {
    // 정상적으로 검색이 완료됐으면
    // 검색 목록과 마커를 표출합니다
    displayPlaces(data);

    // 페이지 번호를 표출합니다
    displayPagination(pagination);
  } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
    alert("검색 결과가 존재하지 않습니다.");
    return;
  } else if (status === kakao.maps.services.Status.ERROR) {
    alert("검색 결과 중 오류가 발생했습니다.");
    return;
  }
}

// 검색 결과 목록과 마커를 표출하는 함수입니다
function displayPlaces(places) {
  let listEl = document.getElementById("placesList"),
    menuEl = document.getElementById("menu_wrap"),
    fragment = document.createDocumentFragment(),
    bounds = new kakao.maps.LatLngBounds(),
    listStr = "";

  // 검색 결과 목록에 추가된 항목들을 제거합니다
  removeAllChildNods(listEl);

  // 지도에 표시되고 있는 마커를 제거합니다
  removeMarker();

  //커스텀 오버레이를 제거
  customOverlay.setMap(null);
  triOverlay.setMap(null);

  for (let i = 0; i < places.length; i++) {
    // 마커를 생성하고 지도에 표시합니다
    let placePosition = new kakao.maps.LatLng(places[i].y, places[i].x),
      marker = addMarker(placePosition, i),
      itemEl = getListItem(i, places[i]); // 검색 결과 항목 Element를 생성합니다

    // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
    // LatLngBounds 객체에 좌표를 추가합니다

    bounds.extend(placePosition);

    // 마커와 검색결과 항목에 mouseover 했을때
    // 해당 장소에 인포윈도우에 장소명을 표시합니다
    // mouseout 했을 때는 인포윈도우를 닫습니다
    (function (marker, title, places) {
      kakao.maps.event.addListener(marker, "click", function () {
        closeOverlay();
        displayCustomOverlay(marker, title, places);
      });

      itemEl.onmouseover = function () {
        displayCustomOverlay(marker, title, places);
      };

      itemEl.onmouseout = function () {
        closeOverlay();
      };
    })(marker, places[i].place_name, places[i]);

    fragment.appendChild(itemEl);
  }

  // 검색결과 항목들을 검색결과 목록 Element에 추가합니다
  listEl.appendChild(fragment);
  menuEl.scrollTop = 0;

  // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
  map.setBounds(bounds);
}

// 검색결과 항목을 Element로 반환하는 함수입니다
function getListItem(index, places) {
  let el = document.createElement("li"),
    itemStr =
      '<span class="markerbg marker_' +
      (index + 1) +
      '">' +
      '<span class="material-symbols-outlined">location_on</span>' +
      "</span>" +
      '<div class="info">' +
      "   <h5>" +
      places.place_name +
      "</h5>";

  if (places.road_address_name) {
    itemStr +=
      "    <span>" +
      places.road_address_name +
      "</span>" +
      '   <span class="jibun gray">' +
      places.address_name +
      "</span>";
  } else {
    itemStr += "    <span>" + places.address_name + "</span>";
  }
  if (places.phone === "")
    itemStr += '  <span class="tel">전화번호 없음</span>';
  else itemStr += '  <span class="tel">' + places.phone + "</span>";

  itemStr +=
    "   <span class='url'>" +
    "<a href=" +
    "'" +
    places.place_url +
    "'" +
    " target='_blank'" +
    ">" +
    "상세정보" +
    "</a>" +
    "</span>" +
    "</div>";
  el.innerHTML = itemStr;
  el.className = "item";

  return el;
}

// 마커를 생성하고 지도 위에 마커를 표시하는 함수입니다
function addMarker(position, idx, title) {
  let imageSrc = "https://ifh.cc/g/w72QOf.png", // 마커 이미지 url
    imageSize = new kakao.maps.Size(31, 35), // 마커 이미지의 크기
    imgOptions = {
      offset: new kakao.maps.Point(16, 34), // 마커 좌표에 일치시킬 이미지 내에서의 좌표
    },
    markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions),
    marker = new kakao.maps.Marker({
      position: position, // 마커의 위치
      image: markerImage,
    });

  marker.setMap(map); // 지도 위에 마커를 표출합니다
  markers.push(marker); // 배열에 생성된 마커를 추가합니다

  return marker;
}

// 지도 위에 표시되고 있는 마커를 모두 제거합니다
function removeMarker() {
  for (let i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers = [];
}

// 검색결과 목록 하단에 페이지번호를 표시는 함수입니다
function displayPagination(pagination) {
  let paginationEl = document.getElementById("pagination"),
    fragment = document.createDocumentFragment(),
    i;

  // 기존에 추가된 페이지번호를 삭제합니다
  while (paginationEl.hasChildNodes()) {
    paginationEl.removeChild(paginationEl.lastChild);
  }

  for (i = 1; i <= pagination.last; i++) {
    let el = document.createElement("a");
    el.href = "#";
    el.innerHTML = i;

    if (i === pagination.current) {
      el.className = "on";
    } else {
      el.onclick = (function (i) {
        return function () {
          pagination.gotoPage(i);
        };
      })(i);
    }

    fragment.appendChild(el);
  }
  paginationEl.appendChild(fragment);
}

//커스텀 오버레이 표시
function displayCustomOverlay(marker, title, places) {
  let el = document.createElement("div");
  let cus_cont = document.createElement("div");
  let cus_logo = document.createElement("div");
  let tri = document.createElement("div");
  el.append(cus_cont, cus_logo);
  let content = "<div id='title'>" + title + "</div>";
  if (places.road_address_name) {
    content +=
      "    <div class='road_name'>" + places.road_address_name + "</div>";
  } else {
    content += "    <div class='road_name'>" + places.address_name + "</div>";
  }
  if (places.phone === "") content += '  <div class="tel">전화번호 없음</div>';
  else content += '  <div class="tel">' + places.phone + "</div>";

  content +=
    "   <div class='url'>" +
    "<a href=" +
    "'" +
    places.place_url +
    "'" +
    " target='_blank'" +
    ">" +
    "상세정보" +
    "</a>" +
    "</div>" +
    "</div>";
  cus_cont.innerHTML = content;
  el.id = "info_win";
  cus_cont.className = "cus_cont";
  cus_logo.id = "cus_logo";
  cus_logo.innerHTML =
    '<span class="material-symbols-outlined" onclick="closeOverlay()">restaurant</span>';
  tri.id = "tri";
  //커스텀 오버레이 창
  customOverlay = new kakao.maps.CustomOverlay({
    map: map,
    position: marker.getPosition(),
    content: el,
    xAnchor: 0.5,
    yAnchor: 1,
  });

  triOverlay = new kakao.maps.CustomOverlay({
    map: map,
    position: marker.getPosition(),
    content: tri,
    xAnchor: 0,
    yAnchor: 1,
  });
  customOverlay.setMap(map);
  triOverlay.setMap(map);
}

// 검색결과 목록의 자식 Element를 제거하는 함수입니다
function removeAllChildNods(el) {
  while (el.hasChildNodes()) {
    el.removeChild(el.lastChild);
  }
}

//정확도 , 거리순 버튼
let btn_acc = document.getElementById("btn_acc");
btn_acc.addEventListener("click", function a() {
  searchOption.sort = kakao.maps.services.SortBy.ACCURACY;
  btn_dis.style.backgroundColor = "#ffa356";
  btn_acc.style.backgroundColor = "#d86200";
  searchPlaces();
});

let btn_dis = document.getElementById("btn_dis");
btn_dis.addEventListener("click", function a() {
  searchOption.sort = kakao.maps.services.SortBy.DISTANCE;
  btn_acc.style.backgroundColor = "#ffa356";
  btn_dis.style.backgroundColor = "#d86200";
  searchPlaces();
});

//랜덤 맛집 이벤트 실행
let btn_ko = document.getElementById("btn_ko");
btn_ko.addEventListener("click", ranPlace);

let btn_jp = document.getElementById("btn_jp");
btn_jp.addEventListener("click", ranPlace);

let btn_ch = document.getElementById("btn_ch");
btn_ch.addEventListener("click", ranPlace);

let btn_eu = document.getElementById("btn_eu");
btn_eu.addEventListener("click", ranPlace);

let btn_ttk = document.getElementById("btn_ttk");
btn_ttk.addEventListener("click", ranPlace);

let btn_meat = document.getElementById("btn_meat");
btn_meat.addEventListener("click", ranPlace);

//커스텀 오버레이 닫기
function closeOverlay() {
  customOverlay.setMap(null);
  triOverlay.setMap(null);
}
