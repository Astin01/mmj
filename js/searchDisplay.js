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
function displayCustomOverlay(marker, places) {
  let el = document.createElement("div");
  let cus_cont = document.createElement("div");
  let cus_logo = document.createElement("div");
  let tri = document.createElement("div");
  el.append(cus_cont, cus_logo);
  let content = "<div id='title'>" + places.place_name + "</div>";
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
//커스텀 오버레이 닫기
function closeOverlay() {
  customOverlay.setMap(null);
  triOverlay.setMap(null);
}
//커스텀 오버레이 제거
function deleteOverlay(content, triContent) {
  content.remove();
  triContent.remove();
}
