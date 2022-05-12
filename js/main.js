$(function () {

  /*-------------------- Variable definition --------------------*/

  // DOM
  const $shutter = $("#shutter");
  const $result_win = $("#result .win");
  const $result_lose = $("#result .lose");

  // Player status
  let MY_SELF = {
    name: "あなた",
    password: "",
    game: 0,
    win: 0,
    lose: 0,
    posing_image: $("#my_posing_image"),
    posing_text: $("#my_posing"),
    hp_gauge: $("#my_hp"),
    hp: 100,
  };

  let ENEMY = {
    posing_image: $("#opp_posing_image"),
    posing_text: $("#opp_posing"),
    hp_gauge: $("#opp_hp"),
    hp: 100,
  };

  // Array
  const posing_image_array = ["posing01.png", "posing02.png", "posing03.png"];
  const posing_array = ["ダブルバイセップス（チョキ）", "サイドチェスト（グー）", "ラットスプレット（パー）"];

  let intervalId;

  init();

  /*-------------------- Main processing --------------------*/


  /**
   * マッスルジャンケン開始
   */
  $(".game_start_btn").on('click', function () {
    $(this).prop("disabled", true);
    gameInit();
    shutterAnimation("+=5.5");
    countDown(5);
    let $current_content = $(this).parents(".__content_wrap__");
    if ($current_content.hasClass("result")) {
      setTimeout(() => {
        $current_content.hide();
        $current_content.siblings(".playing").show();
        $("#auth").hide();
      }, 1500);
    } else {
      setTimeout(() => {
        $current_content.hide();
        $current_content.next().show();
        $("#auth").hide();
      }, 1500);
    }
    intervalId = pictuerChange(1000);
  });

  /**
   * 自分のポーズを選択
   */
  $(".posing_select_btn").on("click", function () {
    $(this).prop("disabled", true);

    // 写真のシャッフルを停止
    clearInterval(intervalId);

    // 自分の出手を取得
    let my_posing = $(this).data("posing");
    MY_SELF.posing_image.html('<img src="./img/' + posing_image_array[$(this).data("int")] + '">');
    displayChar(MY_SELF.posing_text, my_posing, 1100);

    // PCの出手を取得・表示
    let i = Math.floor(Math.random() * 3);
    let opp_posing = posing_array[i];
    ENEMY.posing_image.html('<img src="./img/' + posing_image_array[i] + '">');
    displayChar(ENEMY.posing_text, opp_posing, 1100);

    // あいこの処理
    if (my_posing === opp_posing) {
      displayChar($("#referee"), "ワンモア！！！", 1100);
      ENEMY.posing_image.add(MY_SELF.posing_image).addClass("win");
      setTimeout(() => {
        ENEMY.posing_image.add(MY_SELF.posing_image).removeClass("win");
      }, 1000);
      intervalId = pictuerChange(1000);

      // 自分が勝ちの処理
    } else if (
      (my_posing === "サイドチェスト（グー）" && opp_posing === "ダブルバイセップス（チョキ）") ||
      (my_posing === "ダブルバイセップス（チョキ）" && opp_posing === "ラットスプレット（パー）") ||
      (my_posing === "ラットスプレット（パー）" && opp_posing === "サイドチェスト（グー）")
    ) {
      displayChar($("#referee"), "あなたの勝ち！！！", 1100);
      MY_SELF.posing_image.addClass("win");
      MY_SELF.posing_image.prev(".icon_win").show();
      setTimeout(() => {
        MY_SELF.posing_image.removeClass("win");
        MY_SELF.posing_image.prev(".icon_win").hide();
      }, 1000);

      // HPゲージ状態管理
      ENEMY.hp -= 25;
      ENEMY.hp_gauge.css({ 'width': ENEMY.hp + '%' });
      switch (ENEMY.hp) {
        case 75:
          ENEMY.hp_gauge.addClass("green");
          intervalId = pictuerChange(1000);
          break;
        case 50:
          ENEMY.hp_gauge.addClass("yellow");
          intervalId = pictuerChange(1000);
          break;
        case 25:
          ENEMY.hp_gauge.addClass("red");
          intervalId = pictuerChange(1000);
          break;
        case 0:
          MY_SELF.game += 1;
          MY_SELF.win += 1;
          $shutter.find(".end").show();
          shutterAnimation("+=3");
          let $current_content = $(this).parents(".__content_wrap__");
          setTimeout(() => {
            $(".game_start_btn").prop("disabled", false);
            $current_content.hide();
            $current_content.next().show();
            $result_win.show();
            $("#auth").show();
          }, 1000);
          break;
      }

      // 相手が勝ちの処理
    } else if (
      (opp_posing === "サイドチェスト（グー）" && my_posing === "ダブルバイセップス（チョキ）") ||
      (opp_posing === "ダブルバイセップス（チョキ）" && my_posing === "ラットスプレット（パー）") ||
      (opp_posing === "ラットスプレット（パー）" && my_posing === "サイドチェスト（グー）")
    ) {
      displayChar($("#referee"), "相手の勝ち！！！", 1100);
      ENEMY.posing_image.addClass("win");
      ENEMY.posing_image.prev(".icon_win").show();
      setTimeout(() => {
        ENEMY.posing_image.removeClass("win");
        ENEMY.posing_image.prev(".icon_win").hide();
      }, 1000);

      // HPゲージ状態管理
      MY_SELF.hp -= 25;
      MY_SELF.hp_gauge.css({ 'width': MY_SELF.hp + '%' });
      switch (MY_SELF.hp) {
        case 75:
          MY_SELF.hp_gauge.addClass("green");
          intervalId = pictuerChange(1000);
          break;
        case 50:
          MY_SELF.hp_gauge.addClass("yellow");
          intervalId = pictuerChange(1000);
          break;
        case 25:
          MY_SELF.hp_gauge.addClass("red");
          intervalId = pictuerChange(1000);
          break;
        case 0:
          MY_SELF.game += 1;
          MY_SELF.lose += 1;
          $shutter.find(".end").show();
          shutterAnimation("+=3");
          let $current_content = $(this).parents(".__content_wrap__");
          setTimeout(() => {
            $(".game_start_btn").prop("disabled", false);
            $current_content.hide();
            $current_content.next().show();
            $result_lose.show();
            $("#auth").show();
          }, 1000);
          break;
      }
    }
    $("#auth_status .auth_status_in > span").text(`${MY_SELF.name}　${MY_SELF.game}戦${MY_SELF.win}勝${MY_SELF.lose}敗`);
    let user_data = {
      name: MY_SELF.name,
      password: MY_SELF.password,
      game: MY_SELF.game,
      win: MY_SELF.win,
      lose: MY_SELF.lose
    }
    localStorage.setItem($("#player_name").text(), JSON.stringify(user_data));
  });


  /*-------------------- Function area --------------------*/

  /**
   * 初期化
   */
  function init(){
    checkLogin();
    let a = CryptoJS.AES.encrypt("aaa", "testkey");
    let b = CryptoJS.AES.encrypt("aaa", "key");
    console.log(`暗号前→aaa:${a}　暗号前→aaa:${b}`);
  }

  /**
   * ゲーム初期化
   */
  function gameInit() {
    intervalId = 0;
    $(".game_start_btn").prop("disabled", false);
    $shutter.find(".end").hide();
    setTimeout(() => {
      $("#youtube > ul.btn_blk > li > button").removeClass().css({
        "pointer-events": "auto",
        "opacity": "1"
      });
      MY_SELF.hp = 100;
      ENEMY.hp = 100;
      MY_SELF.hp_gauge.add(ENEMY.hp_gauge).css({ 'width': MY_SELF.hp + '%' });
      MY_SELF.hp_gauge.add(ENEMY.hp_gauge).removeClass();
      $("#youtube > ul.mov_blk").empty();
      $result_win.hide();
      $result_lose.hide();
    }, 3000);
  }

  /**
   * 画像高速切り替え
   */
  function pictuerChange(time) {
    let shuffle_count = 1;
    setTimeout(() => {
      $(".posing_select_btn").prop("disabled", false);
      intervalId = setInterval(() => {
        if (shuffle_count >= posing_image_array.length) {
          shuffle_count = 0;
        }
        ENEMY.posing_image.html('<img src="./img/' + posing_image_array[shuffle_count] + '">');
        MY_SELF.posing_image.html('<img src="./img/' + posing_image_array[shuffle_count] + '">');
        shuffle_count++;
      }, 100);
    }, time);
    return intervalId;
  };

  /**
   * 文字を画面に表示
   */
  function displayChar(e, str, time) {
    e.css({ 'visibility': 'visible' }).text(str);
    setTimeout(() => {
      e.css({ 'visibility': 'hidden' });
    }, time);
  };

  /**
   * アニメーション関係
   */
  function shutterAnimation(time) {
    let tl = gsap.timeline();
    tl.to($shutter, {
      transform: "translateY(0%)",
      duration: 1.2,
      ease: "bounce.out"
    }).to($shutter, {
      transform: "translateY(-100%)",
      duration: 0.8,
    }, '"' + time + '"');
  }

  /**
   * カウントダウン
   */
  function countDown(sec) {
    const $timer = $("#timer");
    $timer.show();
    let count = sec;
    $timer.text(sec);
    let countDownId = setInterval(() => {
      if (count === 0) {
        clearInterval(countDownId);
        setTimeout(() => {
          $timer.hide();
        }, 1000);
      }
      $timer.text(count);
      count--;
    }, 1000);
  }

  /**
   * ルール説明表示・非表示
   */
  $("#rule_explain_btn").on('click', function () {
    $("#rule_explain").show();
    $("#overlay").show();
  });

  /**
   * サインイン画面表示
   */
  $("#signin_btn").on('click', function () {
    $("#sign_in").show();
    $("#overlay").show();
  });

  /**
   * ログイン画面表示
   */
  $("#upper_login_btn").on('click', function () {
    $("#login").show();
    $("#overlay").show();
  });

  /**
   * サインイン、ログイン画面非表示
   */
  $("#overlay").on('click', function () {
    $("#sign_in").hide();
    $("#login").hide();
    $("#overlay").hide();
    $("#rule_explain").hide();
  });

  /**
   * YouTube動画取得
   */
  $("#youtube > ul.btn_blk > li > button").on("click", function () {
    let url = "https://www.googleapis.com/youtube/v3/search?key=AIzaSyAEqzFHJYd8wD_xfZA08YQzD7yXxvCy40w&part=snippet&type=video&maxResults=3&q=%20筋トレ%20ジム";
    url += $(this).data("parts");
    $("#youtube > ul.btn_blk > li > button").css({
      "pointer-events": "none",
      "opacity": "0.1",
    });
    $(this).addClass("selected").css({ "opacity": "1" });
    $.ajax({
      url: url,
      type: "GET",
      dataType: "json",
    })
      .done(function (data) {
        for (let i = 0; i < data.items.length; i++) {
          let html = `
          <li>
            <a href="https://www.youtube.com/watch?v=${data.items[i].id.videoId}" target="_blank">
              <dl>
                <dt>
                  <img src="${data.items[i].snippet.thumbnails.medium.url}">
                </dt>
                <dd>${data.items[i].snippet.title}</dd>
              </dl>
            </a>
          </li>
          `;
          $("#youtube > ul.mov_blk").append(html);
        }
      })
      .fail(function (error) {
        console.log(error);
        $("#youtube > ul.mov_blk").html('<li class="no_video">検索結果はありません</li>')
      });
  });

  /**
   * 会員登録
   */
  $("#register_btn").on("click", function () {
    let flag = false;
    let name = $("input[name=signin_name]").val().replace(/\s+/g, "");
    let password = $("input[name=signin_password]").val().replace(/\s+/g, "");
    let confirm_password = $("input[name=signin_confirm_password]").val().replace(/\s+/g, "");
    $(".error_msg").empty();

    //ユーザーネームバリデーションチェック
    if (name == "") {
      $(".name_error_msg").text("ユーザーネームが入力されていません");
      return false;
    } else if (name.length > 12) {
      $(".name_error_msg").text("ユーザーネームは12文字以内です");
      return false;
    } else if (localStorage.hasOwnProperty(name)) {
      $(".name_error_msg").text("既に使用されています");
      return false;
    } else {
      flag = true;
    }
    //パスワードバリデーションチェック
    if (password == "") {
      $(".password_error_msg").text("パスワードが入力されていません");
      return false;
    } else if (!password.match(/^[a-zA-Z]+$/)) {
      $(".password_error_msg").text("半角英数字のみ使用できます");
      return false;
    } else if (!(6 <= password.length && password.length < 12)) {
      $(".password_error_msg").text("パスワードは6文字以上、12文字以内です");
      return false;
    } else {
      flag = true;
    }
    //パスワード確認バリデーションチェック
    if (confirm_password == "") {
      $(".confirm_password_error_msg").text("パスワードが入力されていません");
      return false;
    } else if (!confirm_password.match(/^[a-zA-Z]+$/)) {
      $(".confirm_password_error_msg").text("半角英数字のみ使用できます");
      return false;
    } else if (!(6 <= confirm_password.length && confirm_password.length < 12)) {
      $(".confirm_password_error_msg").text("パスワードは6文字以上、12文字以内です");
      return false;
    } else {
      flag = true;
    }
    if (password !== confirm_password) {
      $(".password_error_msg").text("パスワードが一致しません");
      $(".confirm_password_error_msg").text("パスワードが一致しません");
      return false;
    } else {
      flag = true;
    }

    if (flag) {
      let user_data = {
        name: name,
        password: CryptoJS.SHA256(password).toString(),
        game: 0,
        win: 0,
        lose: 0
      }
      localStorage.setItem(name, JSON.stringify(user_data));
      $("#sign_in").hide();
      $("#overlay").hide();
      setTimeout(() => {
        alert(`登録完了しました`);
      }, 100);
    }
  });

  /**
   * ログイン
   */
  $("#login_btn").on("click", function () {
    let flag = false;
    let name = $("input[name=login_name]").val().replace(/\s+/g, "");;
    let password = $("input[name=login_password]").val().replace(/\s+/g, "");
    let user_data = JSON.parse(localStorage.getItem(name));
    $(".error_msg").empty();

    //バリデーションチェック
    if (name == "") {
      $(".login_name_error_msg").text("ユーザーネームが入力されていません");
      return false;
    } else if (name.length > 12) {
      $(".login_name_error_msg").text("ユーザーネームは12文字以内です");
      return false;
    } else if (localStorage.getItem(name) == null) {
      $(".login_name_error_msg").text("ユーザーが登録されていません");
      return false;
    } else {
      flag = true;
    }
    if (password == "") {
      $(".login_password_error_msg").text("パスワードが入力されていません");
      return false;
    } else if (!password.match(/^[a-zA-Z]+$/)) {
      $(".login_password_error_msg").text("半角英数字のみ使用できます");
      return false;
    } else if (!(6 <= password.length && password.length < 12)) {
      $(".login_password_error_msg").text("パスワードは6文字以上、12文字以内です");
      return false;
    } else if (CryptoJS.SHA256(password).toString() !== user_data.password) {
      $(".login_password_error_msg").text("パスワードが間違っています");
      return false;
    } else {
      flag = true;
    }

    if (flag) {
      MY_SELF.name = user_data.name;
      MY_SELF.password = user_data.password;
      MY_SELF.game = Number(user_data.game);
      MY_SELF.win = Number(user_data.win);
      MY_SELF.lose = Number(user_data.lose);
      $("#login").hide();
      $("#overlay").hide();
    }

    $("#player_name").text(MY_SELF.name);
    $("#auth_btn").hide();
    $("#auth_status").show();
    $("#auth_status .auth_status_in > span").text(`${MY_SELF.name}　${MY_SELF.game}戦${MY_SELF.win}勝${MY_SELF.lose}敗`).show();
    localStorage.setItem("is_login", MY_SELF.name);
    setTimeout(() => {
      alert(`${MY_SELF.name}さんようこそ！`);
    }, 100);
  });

  /**
   * ログインチェック
   */
  function checkLogin() {
    let login_user = localStorage.getItem("is_login");
    if (login_user !== "") {
      let user_data = JSON.parse(localStorage.getItem(login_user));
      MY_SELF.name = user_data.name;
      MY_SELF.password = user_data.password;
      MY_SELF.game = Number(user_data.game);
      MY_SELF.win = Number(user_data.win);
      MY_SELF.lose = Number(user_data.lose);
      $("#auth_btn").hide();
      $("#auth_status").show();
      $("#auth_status .auth_status_in > span").text(`${MY_SELF.name}　${MY_SELF.game}戦${MY_SELF.win}勝${MY_SELF.lose}敗`);
    } else {
      MY_SELF.name = "あなた";
      MY_SELF.password = "";
      MY_SELF.game = 0;
      MY_SELF.win = 0;
      MY_SELF.lose = 0;
    }
  }

  /**
   * ログアウト
   */
  $("#logout_btn").on("click", function () {
    localStorage.setItem("is_login", "");
    checkLogin();
    $("#auth_status").hide();
    $("#auth_btn").show();
    alert("ログアウトしました");
  });

});