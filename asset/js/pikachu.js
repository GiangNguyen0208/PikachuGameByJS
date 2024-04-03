var audio_bg = new Audio('sound/bg.mp3'); // tạo đối tượng audio
audio_bg.volume = 0.3; // giảm âm lượng xuống 50%
// audio_bg.play(); // chạy audio
audio_bg.append();
// Sử dụng thư viện jhCore để đảm bảo hình ảnh pokemon được tải lên trước bảng trò chơi.
var oStaticURL = '';
jh.ready(
    function () {
        jh("#maintable").attr("class", "mt" + Math.round(Math.random(4) + 1));
        var el;
        loadImage();
    }
);

function highlight(field) {
    field.focus();
    field.select();
}

var PieceWidth = 55;
var PieceHeight = 65;
var div = document.createElement("div");
div.image = document.createElement("img");
const check = true;

//Tạo một ô mới
function newPiece(board, col, row, value) {
    var div = document.createElement("div");
    div.image = document.createElement("img");
    // Gắn hình ảnh
    div.setImage = function (imgIndex) {
        this.image.src = oStaticURL + "asset/img/pieces" + imgIndex + ".png";
        this.valueInMatrix = imgIndex;
    }
    // Nếu mà value > 0 thì gắn ảnh cho ô
    if (value > 0) div.setImage(value);
    // Gán img tag vào div tag
    div.appendChild(div.image);
    div.board = board;
    div.colIndex = col;
    div.rowIndex = row;
    div.style.position = "absolute";
    div.style.left = (col * PieceWidth) - PieceWidth + "px";
    div.style.top = row * PieceHeight + "px";
    div.style.width = PieceWidth + "px";
    div.style.height = PieceHeight + "px";
    div.isVisible = true;
    // Set trạng thái hiển thị
    div.setVisible = function (flag) {
        this.isVisible = flag;
        this.style.visibility = flag ? "visible" : "hidden";
    }
    div.setBorder = function (thick, color) {
        this.image.border = thick;
        this.image.style.borderColor = color;
    }
    // Set border khi được chọn
    div.setHightlight = function () {
        this.setBorder(1, "red");
    }
    // Set opacity mờ lại khi được chọn
    div.setSelected = function (opacity) {
        opacity = (opacity == 100) ? 200 : opacity;
        this.image.style.filter = "alpha(opacity:" + opacity + ")";
        this.image.style.KHTMLOpacity = opacity / 100;
        this.image.style.MozOpacity = opacity / 100;
        this.image.style.opacity = opacity / 100;
    }
    //Set border bình thường khi bỏ chọn
    div.setNormal = function () {
        this.setBorder(1, "#009933");
    }
    //Event chuột khi được chọn
    div.onmouseover = function () {
        // if (check) {
        //
        // }
        this.setHightlight();
    }
    //Event chuột khi bỏ chọn
    div.onmouseout = function () {
        this.setNormal();
    }
    // Bắt sự kiện bấm vào các ô pokemon
    div.onmousedown = function (evt) {
        if (window.event) evt = window.event;
        this.board.onClickPiece(evt, this.colIndex, this.rowIndex);
    }
    div.setNormal();
    return div;
}

var BoardWidth = PieceWidth * 16;
var BoardHeight = PieceHeight * 10;
var totalscore = 0, el;

// Bảng trò chơi
function newBoard() {
    var div = document.createElement("div");
    div.lines = new Array;  //  Tạo List lines là đường đi giữa 2 cell, lines chỉ thực hiện 3 line để kiếm 1 cell khác giống mình.
    for (var i = 0; i < 3; i++) {
        div.lines[i] = document.createElement("div");
        div.lines[i].style.position = "absolute";
        div.lines[i].style.visibility = "hidden";
        div.lines[i].style.backgroundColor = "red";
        div.appendChild(div.lines[i]);
    }
    div.arrPiece = newArray(17);
    for (var i = 1; i <= 16; i++) { // Tạo 16 cột
        for (var j = 1; j <= 9; j++) { // Tạo 9 hàng
            div.arrPiece[i][j] = newPiece(div, i, j, 0);
            div.appendChild(div.arrPiece[i][j]);
        }
    }
    div.style.position = "relative";
    div.style.width = BoardWidth + "px";
    div.style.height = BoardHeight + "px";
    div.style.margin = "50px auto 0 50px";

    // Đặt mức độ cho trò chơi và cập nhật các giá trị như cấp độ, lượt đổi, điểm
    div.setNewLevel = function (level) {
        this.level = level;
        this.arrValue = getNewMatrix();
        this.isWaiting = false;
        repaint("level", this.level);   //  Hiển thị level đã chọn cho người chơi.
        repaint("blood", 10);   //  Hiển thị lượt đổi đã chọn cho người chơi.
        repaint("score", 0);    //  Hiển thị điểm đã chọn cho người chơi.
        this.applyMatrix(); // Thực hiện đưa ảnh vào ô.
        startCountDown();
    }
    // Tạo bảng game và cập nhật lại các giá trị
    div.createBigGame = function (level) {
        if (check) {
            let play_game = new Audio("asset/sound/sound4.mp3");
            play_game.volume = 0.3;
            play_game.play();
        }
        this.level = level;
        this.blood = 10;
        this.score = 0;
        totalscore = 0;
        this.setNewLevel(this.level);
        repaint("score", 0);
    }
    // // Sau hoàn thành xong màn
    // div.setNextLevel = function (level) {
    //     if (this.level == level) {
    //         alert("Bạn đã hoàn thành màn chơi với thành tích bạn ghi được là:" + totalscore + " điểm");
    //         this.createBigGame();
    //     } else {
    //         this.level++;
    //         this.blood++;
    //         totalscore += el.score + elTimebar.tmp;
    //         //alert(totalscore);
    //         this.setNewLevel(this.level);
    //     }
    // }

    // Tiến đến level tiếp theo
    // div.goNextLV = function () {
    //     if (this.level == 6) {
    //         alert("Màn cuối rồi.!");
    //         this.createBigGame();
    //     } else {
    //         this.level++;
    //         this.blood++;
    //         totalscore += el.score + elTimebar.tmp;
    //         //alert(totalscore);
    //         this.setNewLevel(this.level);
    //     }

    // }

    // div.guideMap = function(number) {
    //     // let getLevel = number;
    //     $('.game-instructions').css("display", "flex");
    //     const levels = document.querySelectorAll('.level-instructions');
    //     for (let i = 0; i < levels; i++) {
    //         levels[i].addEventListener("click", function() {
    //             if (number === levels[i].getAttribute('value')) {
    //                 console.log(number);
    //                 $(".choose_level").css("visibility", "hidden");
    //                 let level_intro = document.querySelector("div[value='number'].level-instructions");
    //                 level_intro.css("visibility", "visible");
    //             }
    //         })
    //
    //     }
    //     this.setNewLevel(getLevel);
    //     this.createBigGame(getLevel);
    //     $(".choose_level").css("visibility", "hidden")
    //     $("#loading").css("opacity", "100%");
    // };
    div.level1 = function () {
        // this.guideMap(1);
        this.setNewLevel(1);
        this.createBigGame(1);
        $(".choose_level").css("visibility", "hidden")
        $("#loading").css("opacity", "100%");
    }
    div.level2 = function () {
        // this.setNewLevel(2);
        this.createBigGame(2);
        repaint("score", 0);
        $(".choose_level").css("visibility", "hidden");
        $("#loading").css("opacity", "100%");
    }
    div.level3 = function () {
        // this.setNewLevel(3);
        this.createBigGame(3);
        repaint("score", 0);
        $(".choose_level").css("visibility", "hidden");
        $("#loading").css("opacity", "100%");
    }
    div.level4 = function () {
        // this.setNewLevel(4);
        this.createBigGame(4);
        repaint("score", 0);
        $(".choose_level").css("visibility", "hidden");
        $("#loading").css("opacity", "100%");
    }
    div.level5 = function () {
        // this.setNewLevel(5);
        this.createBigGame(5);
        repaint("score", 0);
        $(".choose_level").css("visibility", "hidden");
        $("#loading").css("opacity", "100%");
    }
    div.level6 = function () {
        // this.setNewLevel(6);
        this.createBigGame(6);
        repaint("score", 0);
        $(".choose_level").css("visibility", "hidden");
        $("#loading").css("opacity", "100%");
    }

    // Khởi động lại bảng game
    div.restart = function () {
        this.createBigGame(this.level);
    }
    div.drawPath = function (arrayList) {
        var point1 = arrayList[0];  // Đưa Cell2 vào vị trí tiếp theo của Arr
        var point2;
        var centre1, centre2;
        var i, rect;
        for (i = 1; i < arrayList.length; i++) {
            point2 = arrayList[i];  // Đưa Cell2 tiêp theo vao.
            centre1 = findCentre(point1.x, point1.y);   // Tìm central của cell1
            centre2 = findCentre(point2.x, point2.y);   // Tìm central của cell2
            rect = getRRR(centre1, centre2);
            this.lines[i - 1].style.left = rect.x - 55 + "px";
            this.lines[i - 1].style.top = rect.y + "px";
            this.lines[i - 1].style.width = rect.width + "px";
            this.lines[i - 1].style.height = rect.height + "px";
            point1 = point2;
        }
        for (i = 1; i < arrayList.length; i++)
            this.lines[i - 1].style.visibility = "visible";
    }
    // Bắt sự kiện khi bấm vào ô pokemon
    div.onClickPiece = function (evt, iClick, jClick) {
        if (check) {
            let onclick_piece = new Audio("asset/sound/sound2.mp3");
            onclick_piece.volume = 0.3;
            onclick_piece.play();
        }
        var mybutton = getMouseButton(evt);
        if (mybutton == 0) {
            // Kiểm tra có ở trong trạng thái chọn hay không
            if (this.isWaiting) {
                this.isWaiting = false;
                // Kiểm tra đường đi
                var list = checkPath(this.arrValue, this.ifirst, this.jfirst, iClick, jClick);
                // Nếu có đường đi hợp lệ
                if (list != null) {
                    this.arrValue[this.ifirst][this.jfirst] = 0; //Đặt lại giá trị của 2 ô này thành giá trị không
                    this.arrValue[iClick][jClick] = 0;
                    this.arrPiece[this.ifirst][this.jfirst].setVisible(false); // Ẩn nó đi
                    this.arrPiece[iClick][jClick].setVisible(false);
                    this.drawPath(list); // Vẽ đường đi
                    setTimeout("afterDrawPath()", 200);
                    if (check) {
                        let true_path = new Audio("asset/sound/sound5.mp3")
                        true_path.volume = 0.3;
                        true_path.play();
                    }
                } else { // Nếu không có đường đi hợp lệ
                    if (check) {
                        let wrong_path = new Audio("asset/sound/sound1.mp3")
                        wrong_path.volume = 0.3;
                        wrong_path.play();
                    }
                    this.arrPiece[this.ifirst][this.jfirst].setSelected(100);
                }
            } else { // Nếu trạng thái chưa chọn
                this.ifirst = iClick;
                this.jfirst = jClick;
                this.arrPiece[iClick][jClick].setSelected(50);
                this.isWaiting = true;
            }
        }
    }
    // Đưa ảnh vào các ô trên ma trận
    div.applyMatrix = function () {
        var i, j;
        for (i = 1; i <= 16; i++) {
            for (j = 1; j <= 9; j++) {
                // Nếu giá trị bằng 0 thì ẩn đi ô đó
                if (this.arrValue[i][j] == 0)
                    this.arrPiece[i][j].setVisible(false);
                else {
                    this.arrPiece[i][j].setVisible(true);
                    this.arrPiece[i][j].setSelected(100); // Nếu ô được bấm vào thì set lại opacity còn 100
                    this.arrPiece[i][j].setImage(this.arrValue[i][j]); // Gán ảnh vào các ô
                }
            }
        }
    }
    return div;

}

// Tạo bảng và load dữ liệu
function loadedAll() {
    el = newBoard();
    el.createBigGame();
    document.getElementById("board").appendChild(el);
    document.getElementById("maintable").style.visibility = "visible";
}

// Tải ảnh các pokemon và đưa vào list
function loadImage() {
    var list = new Array;
    var i;
    for (i = 1; i <= 36; i++) list.push(oStaticURL + "asset/img/pieces" + i + ".png"); // Tạo danh sách cần preload
    var t = new ImagePreloader(list, loadedAll);
}

// Hàm để tải trước hình ảnh trong mảng images
function ImagePreloader(images, callback) {
    this.callback = callback;
    this.nLoaded = 0; // Số ảnh đã load xong
    this.nProcessed = 0; // Số ảnh đã được xử lí (preload hoặc fail)
    this.aImages = new Array; // Mảng chứa đối tượng ảnh được preload
    this.nImages = images.length; // Số lượng ảnh cần preload
    for (var i = 0; i < images.length; i++)
        this.preload(images[i]);
}

// Hàm preload ảnh
ImagePreloader.prototype.preload = function (image) {
    var oImage = new Image;
    this.aImages.push(oImage);
    oImage.onload = ImagePreloader.prototype.onload; // callback khi ảnh được load thành công
    oImage.onerror = ImagePreloader.prototype.onerror; // callback khi ảnh load bị lỗi
    oImage.onabort = ImagePreloader.prototype.onabort; // callback khi quá trình preload bị huỷ
    oImage.oImagePreloader = this;
    oImage.bLoaded = false;
    oImage.src = image;
}

// Hàm xử lý khi đã preload xong tất cả ảnh
ImagePreloader.prototype.onComplete = function () {
    this.nProcessed++; // Tăng số lượng ảnh đã xử lí
    if (this.nProcessed == this.nImages) {
        this.callback();
    }
}

// Hàm callback khi ảnh preload thành công
ImagePreloader.prototype.onload = function () {
    this.bLoaded = true;
    this.oImagePreloader.nLoaded++;
    this.oImagePreloader.onComplete();
}

// Hàm callback khi preload ảnh bị lỗi
ImagePreloader.prototype.onerror = function () {
    this.bError = true;
    this.oImagePreloader.onComplete();
}

// Hàm callback khi preload ảnh bị huỷ
ImagePreloader.prototype.onabort = function () {
    this.bAbort = true;
    this.oImagePreloader.onComplete();
}

// Kiểm tra đường đi, dùng thuật toán BFS
function checkPath(a, i1, j1, i2, j2) {
    // Kiểm tra điều kiện không hợp lệ thì trả về null
    if (i1 == i2 && j1 == j2) return null; // Hai điểm là như nhau
    if (a[i1][j1] == 0 || a[i2][j2] == 0) return null; // Một trong hai diểm có giá trị bằng 0
    if (a[i1][j1] != a[i2][j2]) return null; // Giá trị tại hai điểm không bằng nhau
    var first, last, i, j, t;
    var queue = new Array;
    var dad = newArray(18);
    var count = newArray(18);
    // Thêm điểm bắt đầu vào hàng chờ queue
    for (i = 0; i < 198; i++) queue[i] = new Point(0, 0);
    first = 0;
    last = 0;
    queue[0].x = i1;
    queue[0].y = j1;
    for (i = 0; i < 18; i++)
        for (j = 0; j < 11; j++)
            dad[i][j] = new Point(-1, -1);
    dad[i1][j1].x = -2;
    count[i1][j1] = 0;
    var canGo = new Array;
    var p = new Array;
    var q = new Array;
    // Duyệt phần tử trong queue
    while (first <= last) {
        i = queue[first].x;
        j = queue[first].y;
        first++;
        for (t = 0; t < 4; t++) {
            canGo[t] = true;
            p[t] = i;
            q[t] = j;
        }
        do {
            for (t = 0; t < 4; t++) {
                // Kiểm tra 4 hướng từ phần tử hiện tại
                if (canGo[t]) {
                    p[t] += UU[t];
                    q[t] += VV[t];
                    // Nếu điểm tiếp theo nằm ngoài biên hoặc có giá trị lớn hơn 0, đánh dấu hướng đó là không thể đi
                    if (!myInside(p[t], q[t])) {
                        canGo[t] = false;
                        continue;
                    }
                    // Nếu điểm tiếp theo là điểm kết thúc, cập nhật mảng dad và trả về đường đi từ điểm bắt đầu đến điểm kết thúc
                    if (p[t] == i2 && q[t] == j2) {
                        dad[p[t]][q[t]].x = i;
                        dad[p[t]][q[t]].y = j;
                        return createArrayList(dad, i2, j2);
                    }
                    // Nếu điểm tiếp theo chưa được duyệt và số lượng rẽ không vượt quá 2, cập nhật hàng đợi queue, mảng dad và mảng count.
                    if (a[p[t]][q[t]] > 0) {
                        canGo[t] = false;
                        continue;
                    }
                    // Nếu không tìm thấy đường đi, trả về null.
                    if (dad[p[t]][q[t]].x != -1) continue;
                    if (count[i][j] == 2) continue;
                    last++;
                    queue[last].x = p[t];
                    queue[last].y = q[t];
                    dad[p[t]][q[t]].x = i;
                    dad[p[t]][q[t]].y = j;
                    count[p[t]][q[t]] = count[i][j] + 1;
                }
            }
        } while (canGo[0] || canGo[1] || canGo[2] || canGo[3]);
    }
    return null;
}

// Xử lí sau khi vẽ được đường đi
function afterDrawPath() {
    repaint("score", el.score);
    // Ẩn các đường nối
    for (var i = 0; i < 3; i++)
        el.lines[i].style.visibility = "hidden";
    // Tăng điểm số
    el.score += 10;
    repaint("score", el.score);
    // Kiểm tra nếu điểm đạt tối đa, thì chuyển sang cấp độ mới và set lại score là 0
    if (el.score == 720) {
        clearInterval(timeID);
        el.score = 720 + elTimebar.tmp;
        repaint("score", el.score);
        alert("Bạn đã hoàn thành màn chơi với thành tích bạn ghi được là:" + el.score + " điểm");
        return;
        $(".choose_level").css("visibility", "hidden")
    }
    // Nếu mà cấp độ lớn hơn 1 thì sửa ma trận để thực hiện xử lí các cấp độ sau
    if (el.level > 1) {
        fixMatrix(el.arrValue, el.level);
        el.applyMatrix();
    }
    // Kiểm tra có cặp nào còn có thể loại bỏ không
    if (isEnd(el.arrValue)) {
        repaint("blood", el.blood);
        if (el.blood == 0) {
            clearInterval(timeID);
            alert("Hết lượt đổi");
            el.createBigGame(); // Tạo game mới
        } else { // Bấm vào đổi vị trí để sửa lại ma trận
            repairMatrix(el.arrValue);
            el.blood--;
            el.applyMatrix();
        }
    }
}

// Kiểm tra xem còn cặp nào có thể loại bỏ không
function isEnd(a) {
    var i, j;
    for (i = 1; i <= 16; i++)
        for (j = 1; j <= 9; j++)
            if (a[i][j] > 0)
                if (findTwin(a, i, j) != null)
                    return false;
    return true;
}

// Di chuyển các ô có giá trị trong bảng, khi có không gian trống nào đó, thì nó sẽ di chuyển theo một hướng vector
function fixZone(a, i1, j1, i2, j2, vector) {
    var i, j, p, q;
    var stop;
    do {
        stop = true;
        for (i = i1; i <= i2; i++)
            for (j = j1; j <= j2; j++)
                if (a[i][j] > 0) {
                    p = i + UU[vector];
                    q = j + VV[vector];
                    if (p >= 1 && p <= 16 && q >= 1 && q <= 9) {
                        if (a[p][q] == 0) {
                            swap(a, i, j, p, q);
                            stop = false;
                        }
                    }
                }
    } while (!stop);
}

function fixMatrix(a, fixType) {
    if (fixType == 1) return;
    if (fixType == 2) {
        fixZone(a, 1, 1, 16, 9, 0);  // Dồn xuống tất cả ô
    }
    // Xếp xuống
    else if (fixType == 3) {
        fixZone(a, 1, 1, 16, 4, 0); // Dồn xuống các ô từ hàng 1 đến 4
        fixZone(a, 1, 5, 16, 9, 1); // Dồn lên các ô từ hàng 5 đến 9
    } else if (fixType == 4) {
        fixZone(a, 1, 1, 16, 4, 0); // Dồn xuống các ô từ hàng 1 đến 4
        fixZone(a, 1, 5, 16, 9, 1); // Dồn lên các ô từ hàng 5 đến 9
        fixZone(a, 1, 1, 8, 9, 3); // Dồn qua trái từ cột 1 đến 8
        fixZone(a, 9, 1, 16, 9, 2); // Dồn qua phải từ cột 9 đến 16
    } else if (fixType == 5) {
        fixZone(a, 1, 1, 16, 9, 2);
        fixZone(a, 1, 5, 16, 9, 0);
        fixZone(a, 1, 1, 16, 4, 1);
        fixZone(a, 1, 5, 16, 9, 1);
        fixZone(a, 1, 1, 16, 4, 0);
        fixZone(a, 1, 1, 8, 9, 3);
        fixZone(a, 9, 1, 16, 9, 2);
        fixZone(a, 1, 1, 8, 9, 2);
        fixZone(a, 9, 1, 16, 9, 3);
    } else if (fixType == 6) {
        fixZone(a, 9, 1, 16, 9, 2);
        fixZone(a, 1, 1, 8, 9, 2);
        fixZone(a, 9, 1, 16, 9, 3);
        fixZone(a, 1, 1, 16, 9, 0);
        fixZone(a, 1, 1, 16, 9, 1);
        fixZone(a, 1, 1, 16, 9, 3);
        fixZone(a, 1, 1, 16, 9, 2);
        fixZone(a, 1, 5, 16, 9, 0);
        fixZone(a, 1, 1, 16, 4, 1);
        fixZone(a, 1, 5, 16, 9, 1);
        fixZone(a, 1, 1, 16, 4, 0);
        fixZone(a, 1, 1, 8, 9, 3);
        fixZone(a, 1, 1, 8, 9, 2);
        fixZone(a, 9, 1, 16, 9, 3);
        fixZone(a, 1, 1, 16, 9, 0);
        fixZone(a, 1, 1, 16, 9, 1);
        fixZone(a, 1, 1, 16, 9, 3);
        fixZone(a, 1, 1, 16, 9, 2);
        fixZone(a, 1, 5, 16, 9, 0);
        fixZone(a, 1, 1, 16, 4, 1);
        fixZone(a, 1, 5, 16, 9, 1);
        fixZone(a, 1, 1, 16, 4, 0);
        fixZone(a, 1, 1, 8, 9, 3);
    }

}

// Mảng chứa các giá trị thay đổi theo các toạ độ 4 hướng
var UU = new Array(0, 0, 1, -1);
var VV = new Array(1, -1, 0, 0);

// Dùng để đổi vị trí
function change_block() {
    if (el.blood == 0) {
        alert("Hết lượt đổi rồi..");
    } else {
        repairMatrix(el.arrValue);
        el.applyMatrix();
        el.blood--;
        repaint("blood", el.blood);
    }
}

// Tạo ra một hoán vị ngẫu nhiên
function generateHV(n) {
    var a = new Array;
    var i, j, k, t;
    for (i = 0; i < n; i++) a[i] = n;
    j = n;
    for (i = 0; i < n; i++) {
        k = getRandom(j--) + 1;
        t = 0;
        while (k > 0) {
            if (a[t++] == n) k--;
        }
        a[t - 1] = i;
    }
    return a;
}

// Trộn các phần tử của một mảng
function mixArray(a, n) {
    var b = generateHV(n);
    var c = new Array;
    for (var i = 0; i < n; i++)
        c[i] = a[b[i]];
    for (var i = 0; i < n; i++)
        a[i] = c[i];
}

// Trộn các phần tử của hai mảng
function mixArray2(a, aa, n) {
    var b = generateHV(n);
    var c = new Array;
    var i;
    for (i = 0; i < n; i++)
        c[i] = a[b[i]];
    for (i = 0; i < n; i++)
        a[i] = c[i];
    for (i = 0; i < n; i++)
        c[i] = aa[b[i]];
    for (i = 0; i < n; i++)
        aa[i] = c[i];
}

function findCheat(a) {
    var i, j;
    var b = new Array;
    var c = new Array;
    var k = 0;
    for (i = 1; i <= 16; i++)
        for (j = 1; j <= 9; j++)
            if (a[i][j] > 0) {
                b[k] = i;
                c[k] = j;
                k++;
            }
    mixArray2(b, c, k);
    for (i = 0; i < k - 1; i++)
        for (j = k - 1; j > i; j--)
            if (checkPath(a, b[i], c[i], b[j], c[j]) != null)
                return new Rectangle(b[i], c[i], b[j], c[j]);
    return null;
}

// Dùng để hoá đổi giá trị trong bảng
function swap(a, i1, j1, i2, j2) {
    var tmp = a[i1][j1];
    a[i1][j1] = a[i2][j2];
    a[i2][j2] = tmp;
}

// Sửa lại ma trận khi không có cặp nào để ghép được, hay bấm vào nút đổi vị trí
function repairMatrix(a) {
    var b = new Array;
    var i, j, k = 0;
    // Sao chép mảng b vào ma trận k
    for (i = 1; i <= 16; i++)
        for (j = 1; j <= 9; j++)
            if (a[i][j] > 0) b[k++] = a[i][j];
    mixArray(b, k);
    k = 0;
    for (i = 1; i <= 16; i++)
        for (j = 1; j <= 9; j++)
            if (a[i][j] > 0) a[i][j] = b[k++];
    var tmp = newArray(18);
    for (i = 0; i < 18; i++)
        for (j = 0; j < 11; j++) tmp[i][j] = a[i][j] > 0 ? 1 : 0;
    var rect = findCheat(tmp);
    var k = 0;
    var u = 0,
        v = 0;
    for (i = 1; i <= 16; i++) {
        if (k > 0) break;
        else {
            for (j = 1; j <= 9; j++) {
                if (i != rect.x || j != rect.y) {
                    if (a[i][j] == a[rect.x][rect.y]) {
                        u = i;
                        v = j;
                        k = 1;
                        break;
                    }
                }
            }
        }
    }
    swap(a, rect.width, rect.height, u, v);
}

// Tìm 2 pokemon trùng nhau dựa vào BFS
function findTwin(a, i1, j1) {
    var first, last, i, j, t;
    var queue = new Array;
    var cx = newArray(18);
    var count = newArray(18);
    // Cho điểm bắt đầu vào hàng chờ queue
    for (i = 0; i < 198; i++) queue[i] = new Point();
    first = 0;
    last = 0;
    queue[0].x = i1;
    queue[0].y = j1;
    for (i = 0; i < 18; i++)
        for (j = 0; j < 11; j++) cx[i][j] = true;
    cx[i1][j1] = false;
    count[i1][j1] = 0;
    var canGo = new Array;
    var p = new Array;
    var q = new Array;
    // Bắt đầu duyệt BFS
    while (first <= last) {
        i = queue[first].x;
        j = queue[first].y;
        first++;
        for (t = 0; t < 4; t++) { // Kiểm tra 4 hướng
            canGo[t] = true;
            p[t] = i;
            q[t] = j;
        }
        do {
            for (t = 0; t < 4; t++) {
                if (canGo[t]) {
                    p[t] += UU[t];
                    q[t] += VV[t];
                    if (!myInside(p[t], q[t])) {
                        canGo[t] = false;
                        continue;
                    }
                    if (a[p[t]][q[t]] == a[i1][j1] && cx[p[t]][q[t]])
                        return new Point(p[t], q[t]);
                    if (a[p[t]][q[t]] > 0) {
                        canGo[t] = false;
                        continue;
                    }
                    if (!cx[p[t]][q[t]]) continue;
                    if (count[i][j] == 2) continue;
                    last++;
                    queue[last].x = p[t];
                    queue[last].y = q[t];
                    cx[p[t]][q[t]] = false;
                    count[p[t]][q[t]] = count[i][j] + 1;
                }
            }
        } while (canGo[0] || canGo[1] || canGo[2] || canGo[3]);
    }
    return null;
}

// Kiểm tra điểm có toạ độ (i,j) có nằm trong bảng (mảng) không
function myInside(i, j) {
    return i >= 0 && i < 18 && j >= 0 && j < 11;
}

// Cập nhật lại một phần tử trong html (ví dụ: điểm, lượt đổi, điểm)
function repaint(id, value) {
    var el = document.getElementById(id);
    if (el.hasChildNodes())
        el.removeChild(el.firstChild);
    el.appendChild(document.createTextNode(value));
}

// Tạo và trả về một mảng chứa đường đi từ điểm bắt đầu đến điểm có toạ độ (i, j) dựa vào mảng dad
function createArrayList(dad, i, j) {
    arrayList = new Array;
    var p, q;
    do {
        arrayList.push(new Point(i, j));
        p = dad[i][j].x;
        q = dad[i][j].y;
        i = p;
        j = q;
    } while (i != -2);
    return arrayList;
}

function newArray(col) {
    var a = new Array;
    for (var i = 0; i < col; i++)
        a[i] = new Array;
    return a;
}

function getRandom(n) {
    return Math.round(Math.random() * (n - 1));
}

function Point(x, y) {
    this.x = x;
    this.y = y;
}

function Rectangle(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
}

// Hàm để đảm bảo trong mỗi cột của ma trận, không có pokemon nào bị lặp lại quá hoặc ít hơn 4 lần
function getNewMatrix() {
    var a = newArray(18);
    var i, j, k, t, remain, key;
    var stop;
    // Tạo ma trận và gán giá trị cho tất cả phần tử là 0
    for (i = 0; i < 18; i++)
        for (j = 0; j < 11; j++)
            a[i][j] = 0;
    remain = 144;
    for (k = 1; k <= 36; k++) {
        for (t = 1; t <= 4; t++) {
            // Tạo một số ngẫu nhiên cho key
            key = getRandom(remain--) + 1;
            stop = false;
            for (i = 1; i <= 16; i++) {
                if (stop)
                    break;
                else {
                    for (j = 1; j <= 9; j++) {
                        if (a[i][j] == 0) {
                            key--;
                            if (key == 0) {
                                stop = true;
                                a[i][j] = k;
                                break;
                            }
                        }
                    }
                }
            }
        }
    }
    return a;
}

function findCentre(i, j) {
    return new Point(i * PieceWidth + PieceWidth / 2, j * PieceHeight + PieceHeight / 2);
}

// Tạo hình chữ nhật bao quanh 2 điểm trên mặt phẳng
function getRRR(p1, p2) {
    var x1, y1, x2, y2;
    if (p1.x < p2.x) {
        x1 = p1.x;
        x2 = p2.x;
    } else {
        x2 = p1.x;
        x1 = p2.x;
    }
    if (p1.y < p2.y) {
        y1 = p1.y;
        y2 = p2.y;
    } else {
        y2 = p1.y;
        y1 = p2.y;
    }
    return new Rectangle(x1 - 3, y1 - 3, x2 - x1 + 6, y2 - y1 + 6);
}

var timeID = 0;
var elTimebar = document.getElementById("timebar");
var iffause = true;

// Hàm để bắt đầu đếm ngược thanh thời gian
function startCountDown() {
    if (timeID > 0) clearInterval(timeID);
    elTimebar.tmp = 469;
    elTimebar.style.height = "469px";
    timeID = setInterval("decTime()", 1250);
}

// Hàm đếm ngược thanh thời gian
function decTime() {
    elTimebar.tmp--;
    elTimebar.style.height = elTimebar.tmp + "px";
    // Khi thời gian hết thì sẽ dừng lại thanh thời gian, tạo lại trò chơi và thông báo cho người chơi
    if (elTimebar.tmp == 0) {
        clearInterval(timeID);
        el.createBigGame();
        alert("Bạn đã hết thời gian")
    }
}

function getMouseButton(evt) {
    if (navigator.appName == 'Microsoft Internet Explorer') {
        if (window.event) {
            var tmp = evt.button;
            if (tmp == 1) return 0;
            if (tmp == 4) return 1;
            if (tmp == 2) return 2;
        } else {
            return evt.button;
        }
    } else {
        return evt.button;
    }
}

function open_menu() {
    $(".choose_level").css("visibility", "visible");
    clearInterval(timeID);
}

// function khi bấm vào nút tắt chọn level
function continue_game() {
    $(".choose_level").css("visibility", "hidden");
    decTime();
}

$("#change_sound").on("click", function () {
    audio_bg.pause();
})
// function muted_sound() {
//     audio.pause();
// }
