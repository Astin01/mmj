//랜덤 맛집 요청
function ranPlace(event) {
  let keyword;

  buttonColorReset();

  let id = event.target.id;

  searchOption = {
    location: mypos,
    radius: 10000,
    category_group_code: null,
    sort: kakao.maps.services.SortBy.ACCURACY,
  };

  document.getElementById(id).style.backgroundColor = "#d86200";
  let len = restaurant[id].length;
  if (len == 0) {
    return alert("더이상 결과값을 불러올 수 없습니다");
  } else {
    let ran = Math.floor(Math.random() * len);
    keyword = restaurant[id][ran];
    keyword += " 공릉";
    restaurant[id].splice(ran, 1);
    ps.keywordSearch(keyword, placesSearchRD, searchOption);
  }
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

  while (paginationEl.hasChildNodes()) {
    paginationEl.removeChild(paginationEl.lastChild);
  }

  // 검색 결과 목록에 추가된 항목들을 제거합니다
  removeAllChildNods(listEl);

  // 지도에 표시되고 있는 마커를 제거합니다
  removeMarker();

  //커스텀 오버레이 제거
  let content = document.getElementById("info_win");
  let triContent = document.getElementById("tri");
  if (content && triContent) {
    deleteOverlay(content, triContent);
  }

  //값 제거
  let input = document.getElementById("keyword");
  input.value = "";

  for (let i = 0; i < 1; i++) {
    // 마커를 생성하고 지도에 표시합니다
    let placePosition = new kakao.maps.LatLng(places[i].y, places[i].x),
      marker = addMarker(placePosition, i),
      itemEl = getListItem(i, places[i]); // 검색 결과 항목 Element를 생성합니다

    // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
    // LatLngBounds 객체에 좌표를 추가합니다

    bounds.extend(placePosition);
    // click시에 커스텀 오버레이를 엽니다
    // 마커와 검색결과 항목에 mouseover 했을때
    // 해당 장소에 커스텀 오버레이를 표시합니다
    // mouseout 했을 때는 커스텀 오버레이를 닫습니다

    (function (marker, places) {
      // addEventListener("load", displayCustomOverlay(marker, places));

      kakao.maps.event.addListener(marker, "click", function () {
        closeOverlay();
        displayCustomOverlay(marker, places);
      });

      itemEl.onmouseover = function () {
        displayCustomOverlay(marker, places);
      };

      itemEl.onmouseout = function () {
        closeOverlay();
      };
    })(marker, places[i]);

    const form = document.getElementById("keyword");
    form.placeholder = places[i].place_name;

    fragment.appendChild(itemEl);
  }

  // 검색결과 항목들을 검색결과 목록 Element에 추가합니다
  listEl.appendChild(fragment);
  menuEl.scrollTop = 0;

  // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
  map.setBounds(bounds);
}
