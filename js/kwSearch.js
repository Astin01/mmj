// 키워드 검색을 요청하는 함수입니다
function searchPlaces(buttonId) {
  let keyword = document.getElementById("keyword").value;

  if (buttonId) {
    if (buttonId.id == "btn_dis") {
      searchOption = {
        location: mypos,
        radius: 10000,
        category_group_code: "FD6",
        sort: kakao.maps.services.SortBy.DISTANCE,
      };
    }
  } else {
    searchOption = {
      location: mypos,
      radius: 10000,
      category_group_code: "FD6",
      sort: kakao.maps.services.SortBy.ACCURACY,
    };
  }

  if (!keyword.replace(/^\s+|\s+$/g, "")) {
    return false;
  }

  //버튼 컬러 리셋
  buttonColorReset();
  //버튼 컬러 부여
  if (buttonId) {
    buttonId.style.backgroundColor = "#d86200";
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
    listStr = "",
    len = places.length;

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
  //
  const form = document.getElementById("keyword");
  form.placeholder = " 음식, 음식점 검색";

  for (let i = 0; i < len; i++) {
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
    (function (marker, places) {
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

    fragment.appendChild(itemEl);
  }

  // 검색결과 항목들을 검색결과 목록 Element에 추가합니다
  listEl.appendChild(fragment);
  menuEl.scrollTop = 0;

  // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
  map.setBounds(bounds);
}
