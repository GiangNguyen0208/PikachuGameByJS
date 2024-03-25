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
var selectedPokemonCells = [];


// Thực hiện các chức năng khi StartGame.
function startGame() {
    gameDialog.style.display = 'none';  // Khi click Bắt đầu, Dialog biến mất.
    // View Hiển thị người dùng
    displayLevel();
    createMap(level);
    pokemonCellsBtnAction();

    // Thuật toán pikachu.



    // Bộ đêm giờ.
    startTimer(600);
}


function pokemonCellsBtnAction() {
    const pokemonCells = document.querySelectorAll('.pokemonCells');
    pokemonCells.forEach(function(cell) {
        cell.addEventListener('click', function() {
            // Kiểm tra xem ô Pokemon đã được lật hay chưa và đã có 2 ô được chọn chưa
            if (!cell.classList.contains('flipped') && selectedPokemonCells.length < 2) {
                flipPokemon(cell);  // Lật ô Pokemon.
                selectedPokemonCells.push(cell);    // Thêm ô Pokemon vào danh sách đã chọn.

                // Kiểm tra nếu đã chọn đủ 2 ô Pokemon
                if (selectedPokemonCells.length === 2) {
                    // Nếu 2 ô Pokemon giống nhau.
                    if (checkMatch()) {
                        handleMatch();  // Xử lý khi 2 ô Pokemon giống nhau
                    } else {
                        // Xử lý khi 2 ô Pokemon không giống nhau.
                        handleMismatch();
                    }
                }
            }
        });
    });
}
// Hàm lật ô Pokemon
function flipPokemon(cell) {
    cell.classList.add('flipped');  // Nếu người chơi chọn ô đầu tiên thì sẽ set class="flipped" cho ô đó.
}
function checkMatch() {
    const img1 = selectedPokemonCells[0].style.backgroundImage;
    const img2 = selectedPokemonCells[1].style.backgroundImage;
    return img1 === img2;
}
function handleMatch() {
    console.log("Hai Pokemon giống nhau.");

    selectedPokemonCells = [];  // Đặt lại ds ô POkemon đã chọn.
}
function handleMismatch() {
    console.log("Hai Pokemon ko giống nhau.");

    selectedPokemonCells = [];  // Đặt lại ds ô POkemon đã chọn.
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
function setImg(pokemonCells, imgIndex) { // Hàm gán hình ảnh.
    let linkImg = "/asset/img/pieces"+imgIndex+".png";   // lấy link của ảnh trong folder.
    pokemonCells.style.backgroundImage = "url("+linkImg+")";    // gán background bằng link được lấy trên.
    pokemonCells.style.backgroundSize = "cover";    // cover ảnh toàn thẻ div.
}

function shuffleCells(imagePairs) {
    const rows = imagePairs.length;
    const cols = imagePairs[0].length;

    for (let i = rows - 1; i > 0; i--) {
        for (let j = cols - 1; j > 0; j--) {
            const randomRow = Math.floor(Math.random() * (i + 1));
            const randomCol = Math.floor(Math.random() * (j + 1));

            // Swap matrix[i][j] with matrix[randomRow][randomCol]
            const temp = imagePairs[i][j];
            imagePairs[i][j] = imagePairs[randomRow][randomCol];
            imagePairs[randomRow][randomCol] = temp;
        }
    }

    return imagePairs;
}

function generateImagePairs(row, col) {
    const totalCells = row * col;
    const totalPairs = totalCells / 2;
    const imagePairs = [];  // Tạo 1 ds chứa các cặp ảnh giống nhau.


    for (let i = 0; i < totalPairs; i++) {
        const randomIndex = Math.floor(Math.random()*36) + 1;   // random cho trong 36 ảnh POkemon.
        const imagePair = [randomIndex, randomIndex];  // Lấy 1 cặp hình ảnh.
        imagePairs.push(imagePair); // push --> ds chưa.
    }
    // Sau đó tiến hành xáo tron vị tri cac hinh anh do.
    shuffleCells(imagePairs);
    return imagePairs;
}

function createSmallMap(row, col) {
    const map = document.getElementById('game');
    const imagePairs = generateImagePairs(row, col);    // Tao từng cặp hình ảnh.
    // ĐƯa tưng cặp ảnh vào 1 arr.
    const flattenedPairs = imagePairs.flat();
    for (let i = 0; i < row; i++) {
        for (let j = 0; j < col; j++) {
            let pokemonCells = document.createElement("div");    // Tạo mỗi thẻ div cho mỗi PokemonCell
            pokemonCells.classList.add("pokemonCells"); //  Đặt tên class cho từng Cell Pokemon.
            const imgIndex = i * col + j;
            setImg(pokemonCells, flattenedPairs[imgIndex]);  // Tạo function setIMG cho pokemonCells.
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
    const imagePairs = generateImagePairs(row, col);    // Tao từng cặp hình ảnh.
    // ĐƯa tưng cặp ảnh vào 1 arr.
    const flattenedPairs = imagePairs.flat();
    for (let x = 0; x < row; x++) {
        for (let y = 0; y < col; y++) {
            let pokemonCells = document.createElement("div");    // Tạo mỗi thẻ div cho mỗi PokemonCell
            pokemonCells.classList.add("pokemonCells"); // Đặt tên class cho từng Cell Pokemon.
            const imgIndex = x * col + y;
            setImg(pokemonCells, flattenedPairs[imgIndex]);  // Tạo function setIcon cho pokemonCells.
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


// Lấy level mà người dùng muốn chơi
function selectLevelValue() {
    let selectElement = document.getElementById('game-level');
    return selectElement.value;
}
function displayLevel() {
    console.log("Bạn đã chọn mức độ: " + selectLevelValue());
}
window.onload = function() {
    showGameDialog();
};
