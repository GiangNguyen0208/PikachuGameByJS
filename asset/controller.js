
function startTimer(durationSeconds) {
    var timerTextEle = document.getElementById('timer-text');
    var timerBarEle = document.getElementById('timer-bar');
    var textbar = document.getElementById('timer-percent');

    var timer = durationSeconds;
    var minutes, seconds;

    var startTime = Date.now();
    var endTime = startTime + (durationSeconds * 1000);

    // Tạo hàm bộ đếm thời gian bằng text
    var interval = setInterval(function() {
        minutes = parseInt(timer/60, 10);
        seconds = parseInt(timer%60, 10);
        // Biểu diễn thời gian bằng text
        timerTextEle.textContent = minutes + " phút : " + seconds + " giây";
        if (--timer <= 0) {
            clearInterval(interval);    // Dừng bộ đếm khi thời gian kết thúc.
            timerTextEle.textContent = "Hết thời gian!";
        }
    }, 1000) // Thực hiện gọi hàm sau mỗi 1s.

    // Cập nhật thời gian.
    function updateTimer() {
        var currentTime = Date.now();
        var remainingTime = endTime - currentTime;
        var progress = (remainingTime / (durationSeconds*1000))*100;    // Thanh bar sẽ tụt mỗi lần 0,1%

        // Nếu tiến trình về 0.
        if (progress <= 0) {
            clearInterval(interval);    // Dừng bộ đếm khi hết thời gian.
            timerBarEle.style.width = "0%"; // Trả thanh Thanh Bar về width = 0%.
            console.log("Hết giờ!");
        } else {
            var percent = Math.round(progress);
            timerBarEle.style.left = progress + "%";
            textbar.innerText = percent + "%";
        }
    }
    updateTimer();  // thực hiện update
    var timeInterval = setInterval(updateTimer, 100);   // thực hiện update sau mỗi 100 miliseconds.
}


var gameDialog = document.getElementById("game-dialog");
var gameBoard = document.getElementById("board-game");
var level = selectLevelValue(); // mặc định level là 1;
var row, col;
function checkLevelClick(level) {
    if (level === '1') {
        createSmallMap(6, 8);
    } else {
        createBigMap(12, 20);
    }
}
function showGameDialog() {
    gameDialog.style.display = 'block';
}
function setImg(pokemonCells) { // Hàm gán hình ảnh.
    let ranInt = Math.floor(Math.random() * 36) + 1;    // random 1 số từ 1 đến 36
    let linkImg = "/asset/img/pieces"+ranInt+".png";   // lấy link của ảnh trong folder.
    pokemonCells.style.backgroundImage = "url("+linkImg+")";    // gán background bằng link được lấy trên.
    pokemonCells.style.backgroundSize = "cover";    // cover ảnh toàn thẻ div.
}
function createSmallMap(row, col) {
    const map = document.getElementById('game');
    for (let i = 0; i < row; i++) {
        for (let j = 0; j < col; j++) {
            let pokemonCells = document.createElement("div");    // Tạo mỗi thẻ div cho mỗi PokemonCell
            pokemonCells.classList.add("pokemonCells"); //Thêm vào list.
            setImg(pokemonCells);  // Tạo function setIcon cho pokemonCells.
            map.appendChild(pokemonCells);  // Đưa vào map.
        }
        // Đưa 1 thẻ clearfix vào mỗi hàng tiếp theo để không bị ảnh hưởng bởi float.
        let clearfix = document.createElement("div");
        clearfix.classList.add("clearfix");
        map.appendChild(clearfix);
    }
    return map;
}
function createBigMap(row, col) {
    const map = document.getElementById('game');
    for (let x = 0; x < row; x++) {
        for (let y = 0; y < col; y++) {
            let pokemonCells = document.createElement("div");    // Tạo mỗi thẻ div cho mỗi PokemonCell
            pokemonCells.classList.add("pokemonCells"); // Tạo class cho thẻ.
            setImg(pokemonCells);  // Tạo function setIcon cho pokemonCells.
            map.appendChild(pokemonCells);  // Đưa vào map.
        }
        // Đưa 1 thẻ clearfix vào mỗi hàng tiếp theo để không bị ảnh hưởng bởi float.
        let clearfix = document.createElement("div");
        clearfix.classList.add("clearfix");
        map.appendChild(clearfix);
    }
    return map;
}
function checkDuplicate() {
    // Kiểm tra trùng lặp các hình ảnh, nếu số ảnh trùng lặp là "số lẻ" thì xóa ảnh trùng lặp gần nhất và random ra ảnh khác.
    // Đệ quy tương tự nếu hình ảnh khác gặp trường hợp trên.
}

// Tạo view trò chơi.
function createMap(level) {

    // Gán hình ảnh.
    checkLevelClick(level); // Thực thi hàm Kiểm tra level.
}

// Lấy level mà người dùng muốn chơi
function selectLevelValue() {
    let selectElement = document.getElementById('game-level');
    return selectElement.value;
}
function startGame() {
    gameDialog.style.display = 'none';  // Khi click Bắt đầu, Dialog biến mất.
    createMap(level);


    startTimer(600);
}




window.onload = function() {
    showGameDialog();
};
