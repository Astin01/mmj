//정확도 , 거리순 버튼
let btn_acc = document.getElementById("btn_acc");
btn_acc.addEventListener("click", function a() {
  searchOption.sort = kakao.maps.services.SortBy.ACCURACY;
  searchPlaces(btn_acc);
  // btn_acc.style.backgroundColor = "#d86200";
});

let btn_dis = document.getElementById("btn_dis");
btn_dis.addEventListener("click", function a() {
  searchOption.sort = kakao.maps.services.SortBy.DISTANCE;
  searchPlaces(btn_dis);
});

//랜덤 맛집 이벤트 실행
let ran_btt = document.querySelectorAll("#ran_btt button");
ran_btt.forEach((btn) => {
  btn.addEventListener("click", ranPlace);
});

function buttonColorReset() {
  const button = document.getElementsByTagName("button");
  const btn_len = button.length;
  for (let i = 0; i < btn_len; i++) {
    button[i].style.backgroundColor = "#ffa356";
  }
}
