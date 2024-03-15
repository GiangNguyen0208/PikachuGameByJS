

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





// Thực hiện các chức năng của game Pikachu.
var gameDialog = document.getElementById("game-dialog");
var gameBoard = document.getElementById("board-game");
var level = 1;  //  Mặc định level nếu không click là 1.
var row, col;
var pokemonImgs = new Map()

// Thực hiện các chức năng khi StartGame.
function startGame() {
    gameDialog.style.display = 'none';  // Khi click Bắt đầu, Dialog biến mất.
    // View Hiển thị người dùng
    displayLevel();
    createMap(level);
    // pokemonCellsBtnAction();
    checkDuplicate();

    // Thuật toán pikachu.



    // Bộ đêm giờ.
    startTimer(600);
}
// Tạo Map trò chơi.
function createMap(level) {
    level = selectLevelValue(); // Kiểm tra mức độ level người dùng đã chọn.
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
    let nameImg = linkImg.slice(11,linkImg.length);
    pokemonCells.style.backgroundImage = "url("+linkImg+")";    // gán background bằng link được lấy trên.
    pokemonCells.style.backgroundSize = "cover";    // cover ảnh toàn thẻ div.
    pokemonImgs.set(nameImg, linkImg);

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
        map.style.margin = 100 + "px " + 190 + "px";
    }
    return map;
}
function checkDuplicate() {
    // Tạo 1 Map để lưu trữ số lần xuất hình ảnh của mỗi imgURL.
    const imgURLCounts = new Map();

    // Đếm số lần xuất hiện của mỗi imgURL.
    pokemonImgs.forEach(function(value, key) {
        imgURLCounts.set(key, (imgURLCounts.get(key) || 0) + 1);
    });

    // Kiểm tra tổng số lần xuất hiện của mỗi imgURL.
    var totalOccurrences = 0;
    imgURLCounts.forEach(function(count) {
        totalOccurrences += count;
    });

    // Nếu tổng số lần xuất hiện của mỗi imgURL là số lẻ.
    if (totalOccurrences % 2 !== 0) {
        // Tìm và xóa 1 PokemonCell có keyImgURL tương ứng và thêm 1 keyImgURL ngẫu nhiên.
        var removed = false;
        while (!removed) {
            // Lấy 1 imgURL ngẫu nhiên từ Map.
            const randomIndex = Math.floor(Math.random() * pokemonImgs.size);
            const randomImgURL = Array.from(pokemonImgs.keys())[randomIndex];

            // Xóa một PokemonCell có imgURL tương ứng
            if (imgURLCounts.get(randomImgURL) % 2 !== 0) {
                pokemonImgs.delete(randomImgURL);
                removed = true;
            }

            // Thêm imgURL ngẫu nhiên vào Map nếu đã xóa
            if (removed) {
                const newRandomIndex = Math.floor(Math.random() * pokemonImgs.size);
                const imgURLs = Array.from(pokemonImgs.keys());
                const newRandomImgURL = imgURLs[newRandomIndex];
                const randomImg = pokemonImgs.get(newRandomImgURL);
                pokemonImgs.delete(newRandomImgURL);
                pokemonImgs.set(newRandomImgURL, randomImg);
            }
        }
    }
}


// Lấy level mà người dùng muốn chơi
function selectLevelValue() {
    let selectElement = document.getElementById('game-level');
    return selectElement.value;
}


function displayLevel() {
    console.log("Bạn đã chọn mức độ: " + selectLevelValue());
}

function pokemonCellsBtnAction() {
    const pokemonCells = document.querySelectorAll('.pokemonCells');
    pokemonImgs.forEach(function(cell) {
        cell.addEventListener('click', function() {
            // Thêm hoặc xóa lớp 'clicked' khi PokemonCell được click
            console.log('Bạn đã click vào: ' + cell.value);
        })
    })
}






window.onload = function() {
    showGameDialog();
};
