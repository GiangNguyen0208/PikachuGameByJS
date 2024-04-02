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
        const currentTime = Date.now();
        const remainingTime = endTime - currentTime;
        const progress = (remainingTime / (durationSeconds*1000))*100;    // Thanh bar sẽ tụt mỗi lần 0,1%

        // Nếu tiến trình về 0.
        if (progress <= 0) {
            clearInterval(interval);    // Dừng bộ đếm khi hết thời gian.
            timerBarEle.style.width = "0%"; // Trả thanh Thanh Bar về width = 0%.
            console.log("Hết giờ!");
        } else {
            const percent = Math.round(progress);
            timerBarEle.style.left = progress + "%";
            textbar.innerText = percent + "%";
        }
    }
    updateTimer();  // thực hiện update
    const timeInterval = setInterval(updateTimer, 100);   // thực hiện update sau mỗi 100 miliseconds.
}





// Thực hiện các chức năng của game Pikachu.
var gameDialog = document.getElementById("game-dialog");
var gameBoard = document.getElementById("board-game");
var level = 1;  //  Mặc định level nếu không click là 1.
var row, col;
var selectedPokemonCells = [];
var totalscore = 0;
var blood = 0;


// Thực hiện các chức năng khi StartGame.
function startGame() {
    gameDialog.style.display = 'none';  // Khi click Bắt đầu, Dialog biến mất.
    // View Hiển thị người dùng
    displayLevel();
    createMap(level);
    pokemonCellsBtnAction();


}

class Point {
    constructor(row, col) {
        this.row = row;
        this.col = col;
    }
}

class MyLine {
    constructor(position1, position2) {
        this.position1 = position1;
        this.position2 = position2;
    }
    toString() {
        return `(${this.position1.row},${this.position1.col}) and (${this.position2.row},${this.position2.col})`;
    }
}

function createMatrix(rows, columns) {
    const matrix = [];

    // Tạo một mảng chứa các số từ 1 đến 36
    const numbers = [];
    for (let i = 1; i <= 36; i++) {
        numbers.push(i);
    }
    // Khởi tạo ma trận và gán các giá trị vào các ô
    let index = 0;
    for (let i = 0; i < rows; i++) {
        const row = [];
        for (let j = 0; j < columns; j += 2) {
            const randomNumber = numbers[index++ % numbers.length];
            row.push(randomNumber);
            row.push(randomNumber);
        }
        matrix.push(row);
    }

    return matrix;
}

// Hàm kiểm tra với đường thẳng theo trục x, từ cột y1 đến y2
function checkLineX(y1, y2, x) {
    // Tìm điểm có cột nhỏ nhất và lớn nhất
    const min = Math.min(y1, y2);
    const max = Math.max(y1, y2);
    // Duyệt qua các cột
    for (let y = min; y <= max; y++) {
        if (matrix[x][y] === barrier) { // Nếu gặp chướng ngại vật thì chết
            console.log("die: " + x + "" + y);
            return false;
        }
        console.log("ok: " + x + "" + y);
    }
    // Không chết -> thành công
    return true;
}
// Hàm kiểm tra với đường thẳng theo trục y, từ hàng x1 đến x2
function checkLineY(x1, x2, y) {
    const min = Math.min(x1, x2);
    const max = Math.max(x1, x2);
    for (let x = min; x <= max; x++) {
        if (matrix[x][y] === barrier) {
            console.log("die: " + x + "" + y);
            return false;
        }
        console.log("ok: " + x + "" + y);
    }
    return true;
}

// Hàm kiểm tra trong hình chữ nhật theo trục x
function checkRectX(p1, p2) {
    // Tìm điểm có cột nhỏ nhất và lớn nhất
    let pMinY = p1, pMaxY = p2;
    if (p1.y > p2.y) {
        pMinY = p2;
        pMaxY = p1;
    }
    for (let y = pMinY.y + 1; y < pMaxY.y; y++) {
        // Kiểm tra ba đoạn thẳng
        if (checkLineX(pMinY.y, y, pMinY.x)
            && checkLineY(pMinY.x, pMaxY.x, y)
            && checkLineX(y, pMaxY.y, pMaxY.x)) {
            console.log("Rect x");
            console.log("(" + pMinY.x + "," + pMinY.y + ") -> ("
                + pMinY.x + "," + y + ") -> (" + pMaxY.x + "," + y
                + ") -> (" + pMaxY.x + "," + pMaxY.y + ")");
            // Nếu ba đoạn thẳng đều đúng thì trả về cột y
            return y;
        }
    }
    // Nếu có một đoạn thẳng nào đó không đúng thì trả về -1
    return -1;
}

// Hàm kiểm tra trong hình chữ nhật theo trục y
function checkRectY(p1, p2) {
    // Tìm điểm có hàng nhỏ nhất và lớn nhất
    let pMinX = p1, pMaxX = p2;
    if (p1.x > p2.x) {
        pMinX = p2;
        pMaxX = p1;
    }
    // Tìm đường và hàng bắt đầu
    for (let x = pMinX.x + 1; x < pMaxX.x; x++) {
        if (checkLineY(pMinX.x, x, pMinX.y)
            && checkLineX(pMinX.y, pMaxX.y, x)
            && checkLineY(x, pMaxX.x, pMaxX.y)) {
            console.log("Rect y");
            console.log("(" + pMinX.x + "," + pMinX.y + ") -> (" + x
                + "," + pMinX.y + ") -> (" + x + "," + pMaxX.y
                + ") -> (" + pMaxX.x + "," + pMaxX.y + ")");
            return x;
        }
    }
    return -1;
}

// Hàm kiểm tra nhiều đường thẳng hơn theo trục x
function checkMoreLineX(p1, p2, type) {
    // Tìm điểm có hàng nhỏ nhất
    let pMinY = p1, pMaxY = p2;
    if (p1.y > p2.y) {
        pMinY = p2;
        pMaxY = p1;
    }
    // Tìm đường và hàng bắt đầu
    let y = pMaxY.y;
    let row = pMinY.x;
    if (type === -1) {
        y = pMinY.y;
        row = pMaxY.x;
    }
    // Kiểm tra nhiều hơn
    if (checkLineX(pMinY.y, pMaxY.y, row)) {
        while (matrix[pMinY.x][y] !== barrier
        && matrix[pMaxY.x][y] !== barrier) {
            if (checkLineY(pMinY.x, pMaxY.x, y)) {
                console.log("TH X " + type);
                console.log("(" + pMinY.x + "," + pMinY.y + ") -> ("
                    + pMinY.x + "," + y + ") -> (" + pMaxY.x + "," + y
                    + ") -> (" + pMaxY.x + "," + pMaxY.y + ")");
                return y;
            }
            y += type;
        }
    }
    return -1;
}

// Hàm kiểm tra nhiều đường thẳng hơn theo trục y
function checkMoreLineY(p1, p2, type) {
    let pMinX = p1, pMaxX = p2;
    if (p1.x > p2.x) {
        pMinX = p2;
        pMaxX = p1;
    }
    let x = pMaxX.x;
    let col = pMinX.y;
    if (type === -1) {
        x = pMinX.x;
        col = pMaxX.y;
    }
    if (checkLineY(pMinX.x, pMaxX.x, col)) {
        while (matrix[x][pMinX.y] !== barrier
        && matrix[x][pMaxX.x] !== barrier) {
            if (checkLineX(pMinX.y, pMaxX.y, x)) {
                console.log("TH Y " + type);
                console.log("(" + pMinX.x + "," + pMinX.y + ") -> ("
                    + x + "," + pMinX.y + ") -> (" + x + "," + pMaxX.y
                    + ") -> (" + pMaxX.x + "," + pMaxX.y + ")");
                return x;
            }
            x += type;
        }
    }
    return -1;
}

// Hàm kiểm tra hai điểm
function checkTwoPoint(p1, p2) {
    // Kiểm tra đường thẳng theo trục x
    if (p1.x === p2.x) {
        if (checkLineX(p1.y, p2.y, p1.x)) {
            return new MyLine(p1, p2);
        }
    }
    // Kiểm tra đường thẳng theo trục y
    if (p1.y === p2.y) {
        if (checkLineY(p1.x, p2.x, p1.y)) {
            return new MyLine(p1, p2);
        }
    }
    let t = -1; // t là cột tìm được
    // Kiểm tra trong hình chữ nhật theo trục x
    if ((t = checkRectX(p1, p2)) !== -1) {
        return new MyLine(new Point(p1.x, t), new Point(p2.x, t));
    }
    // Kiểm tra trong hình chữ nhật theo trục y
    if ((t = checkRectY(p1, p2)) !== -1) {
        return new MyLine(new Point(t, p1.y), new Point(t, p2.y));
    }
    // Kiểm tra nhiều hơn về phải
    if ((t = checkMoreLineX(p1, p2, 1)) !== -1) {
        return new MyLine(new Point(p1.x, t), new Point(p2.x, t));
    }
    // Kiểm tra nhiều hơn về trái
    if ((t = checkMoreLineX(p1, p2, -1)) !== -1) {
        return new MyLine(new Point(p1.x, t), new Point(p2.x, t));
    }
    // Kiểm tra nhiều hơn xuống dưới
    if ((t = checkMoreLineY(p1, p2, 1)) !== -1) {
        return new MyLine(new Point(t, p1.y), new Point(t, p2.y));
    }
    // Kiểm tra nhiều hơn lên trên
    if ((t = checkMoreLineY(p1, p2, -1)) !== -1) {
        return new MyLine(new Point(t, p1.y), new Point(t, p2.y));
    }
    return null;
}



// Hàm kiểm tra xem điểm có nằm trong phạm vi bảng không
function isValidPoint(col, row, a) {
    // Bảng có kích thước row x col.
    const maxCol = a[0].length;
    const maxRow = a.length;

    return col >= 0 && col < maxCol && row >= 0 && row < maxRow;
}

function pokemonCellsBtnAction() {
    const pokemonCells = document.querySelectorAll('.pokemonCells');
    pokemonCells.forEach(function(cell) {
        cell.addEventListener('click', function() {
            const namePokemonCell = cell.style.backgroundImage;
            const position = getPokemonPosition(cell); // Lấy vị trí của ô Pokemon được chọn
            // Kiểm tra xem ô Pokemon đã được lật hay chưa và đã có 2 ô được chọn chưa
            console.log("Bạn đã click vào " + namePokemonCell.slice(16, namePokemonCell.length - 5));
            if (!cell.classList.contains('flipped') && selectedPokemonCells.length < 2) {
                flipPokemon(cell, position.row, position.col);  // Lật ô Pokemon.
                selectedPokemonCells.push(cell); // Lưu lại ô Pokemon và vị trí của nó vào mảng selectedPokemonCells
                for (let i = 0; i < selectedPokemonCells.length; i++) {
                    if (selectedPokemonCells[i]) { // Kiểm tra xem phần tử có tồn tại không
                        setVisibleClickCell(selectedPokemonCells[i], "1");
                    }
                }

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
//  Hiển thị Cell đã chọn
function setVisibleClickCell(cell, paddingNum) {
    cell.style.padding = paddingNum+"px";
}

function checkMatch() {
    const img1 = selectedPokemonCells[0].style.backgroundImage; // Lấy backgroundImage của cell 1
    const img2 = selectedPokemonCells[1].style.backgroundImage; // Lấy backgroundImage của cell 2
    return img1 === img2;
}

function displayFinishedGame() {
    console.log('Chúc mừng bạn đã vượt qua mức độ: ' + selectLevelValue());
}
function getPokemonCellByPosition(row, col) {
    return document.querySelector(`div[row='${row}'][col='${col}']`);
}
// Hàm lấy vị trí của ô Pokemon trong ma trận
function getPokemonPosition(pokemonCell) {
    const row = Number.parseInt(pokemonCell.getAttribute('row')); //  Lấy giá trị của row
    const col = Number.parseInt(pokemonCell.getAttribute('col')); //  Lấy giá trị của col

    console.log(row + " and  " + col);
    return { "row": row, "col": col}; // Trả về vị trí của ô Pokemon dưới dạng object
}
// Trong hàm flipPokemon:
function flipPokemon(cell, row, col) {
    cell.classList.add('flipped');  // Nếu người chơi chọn ô đầu tiên thì sẽ set class="flipped" cho ô đó.
    cell.setAttribute('row', row+""); // Thiết lập giá trị của row cho pokemonCell
    cell.setAttribute('col', col+""); // Thiết lập giá trị của col cho pokemonCell
}
function handleMatch() {
    const position1 = getPokemonPosition(selectedPokemonCells[0]);
    const position2 = getPokemonPosition(selectedPokemonCells[1]);

    console.log("Vị trí của Pokemon 1: ", position1);
    console.log("Vị trí của Pokemon 2: ", position2);

    // let matrix = [];
    // if (level === '1') {
    //     matrix = createMatrix(6, 8);
    // } else {
    //     matrix = createMatrix(12,20);
    // }
    const cell1 = getPokemonCellByPosition(position1.row, position1.col);
    const cell2 = getPokemonCellByPosition(position2.row, position2.col);

    const canMove = checkTwoPoint(position1, position2);

    if (canMove !== null) {
        console.log("2 Pokemon giong nhau");
        if (selectLevelValue() == 1 || selectLevelValue() == 2) {
            setHiddenVisibleCell(cell1, cell2, "hidden", "0px");
        } else {
            setNoneDisplayCell(cell1, cell2, "none", "0px");
        }
    }
    selectedPokemonCells = [];  // Đặt lại ds ô POkemon đã chọn.
}
function setNoneDisplayCell(cell1, cell2, display, padding) {
    cell1.style.display = display;
    cell2.style.display = display;
}
function setHiddenVisibleCell(cell1, cell2, visible, padding) {
    cell1.style.visibility = visible;
    cell1.style.padding = padding;
    cell2.style.visibility = visible;
    cell2.style.padding = padding;
}
function handleMismatch() {
    for (let i = 0; i < selectedPokemonCells.length; i++) {
        selectedPokemonCells[i].style.padding = "0";
    }
    console.log("Hai Pokemon ko giống nhau.");
    selectedPokemonCells = [];  // Đặt lại ds ô POkemon đã chọn.
}

function showGameDialog() {
    gameDialog.style.display = 'block';
}

// Tạo Map trò chơi.
function createMap(level) {
    level = selectLevelValue(); // Kiểm tra mức độ level người dùng đã chọn.
    let matrix = [];
    if (level === '1') {
        matrix = createMatrix(6, 8);
        displayMatrixSmallView(matrix);
        generateImagePairs(matrix.length, matrix[0].length);
        startTimer(300);
    } else {
        matrix = createMatrix(12,20);
        displayMatrixBigView(matrix);
        generateImagePairs(matrix.length, matrix[0].length);
        startTimer(300);
    }
}
function shufflePokemonCells(row, col) {
    const pokemonCells = document.querySelectorAll('.pokemonCells');
    const shuffledCells = Array.from(pokemonCells).sort(() => Math.random() - 0.5); // Xáo trộn các ô

    const map = document.getElementById('game');
    map.innerHTML = ''; // Xóa nội dung của bảng game hiện tại

    for (let i = 0; i < shuffledCells.length; i++) {
        const cell = shuffledCells[i];

        // Tính chỉ số của dòng và cột cho ô hiện tại
        const rowIndex = Math.floor(i / col);
        const colIndex = i % col;

        // Thiết lập thuộc tính "row" và "col" cho ô
        cell.setAttribute("row", rowIndex+"");
        cell.setAttribute("col", colIndex+"");

        map.appendChild(cell); // Thêm các ô đã xáo trộn vào bảng game

        // Nếu đã thêm đủ số cột ô vào hàng, tạo một hàng mới
        if ((i + 1) % col === 0) {
            const clearDiv = document.createElement('div');
            clearDiv.style.clear = 'both';
            map.appendChild(clearDiv);
        }
    }
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
    shufflePokemonCells(row, col);
    return imagePairs;
}
function setImg(pokemonCells, imgIndex) { // Hàm gán hình ảnh.
    let linkImg = "/asset/img/pieces"+imgIndex+".png";   // lấy link của ảnh trong folder.
    pokemonCells.style.backgroundImage = "url("+linkImg+")";    // gán background bằng link được lấy trên.
    pokemonCells.style.backgroundSize = "cover";    // cover ảnh toàn thẻ div.
}
function displayMatrixSmallView(matrix) {
    const map = document.getElementById('game');
    const row = matrix.length;
    const col = matrix[0].length;
    // const imagePairs = generateImagePairs(row, col);    // Tao từng cặp hình ảnh.
    // const flattenedPairs = imagePairs.flat();   // ĐƯa tưng cặp ảnh vào 1 arr.
    if (!Array.isArray(matrix)) {
        console.error("Matrix is not an array!");
        return null; // Trả về null hoặc giá trị mặc định khác tùy vào trường hợp của bạn
    }
    for (const row of matrix) {
        const rowDiv = document.createElement('div');
        rowDiv.classList.add('row');
        rowDiv.style.position = "absolute";
        for (const value of row) {
            let pokemonCells = document.createElement("div");    // Tạo mỗi thẻ div cho mỗi PokemonCell
            pokemonCells.classList.add("pokemonCells"); //  Tao tên class cho từng Cell Pokemon.
            setImg(pokemonCells, value);    // Tạo function setIMG cho pokemonCells.
            rowDiv.appendChild(pokemonCells);  // Đưa vào map.
        }
        map.appendChild(rowDiv);
    }
    return map;
    map.style.position = "relative";

    // // Đặt mức độ cho trò chơi và cập nhật các giá trị như cấp độ, lượt đổi, điểm
    // map.setNewLevel = function(level) {
    //     this.level = level;
    //     this.arrValue = getNewMatrix();
    //     this.isWaiting = false;
    //     repaint("level", this.level);
    //     repaint("blood", this.blood);
    //     repaint("score", totalscore);
    //     this.applyMatrix();
    //     startCountDown();
    // }

}
function displayMatrixBigView(matrix) {
    const map = document.getElementById('game');
    const row = matrix.length;
    const col = matrix[0].length;
    // const imagePairs = generateImagePairs(row, col);    // Tao từng cặp hình ảnh.
    // const flattenedPairs = imagePairs.flat();   // ĐƯa tưng cặp ảnh vào 1 arr.
    if (!Array.isArray(matrix)) {
        console.error("Matrix is not an array!");
        return null; // Trả về null hoặc giá trị mặc định khác tùy vào trường hợp của bạn
    }
    for (const row of matrix) {
        const rowDiv = document.createElement('div');
        rowDiv.classList.add('row');
        for (const value of row) {
            let pokemonCells = document.createElement("div");    // Tạo mỗi thẻ div cho mỗi PokemonCell
            // pokemonCells.setAttribute("row",row+"");
            // pokemonCells.setAttribute("col", col+"");
            pokemonCells.classList.add("pokemonCells"); //  Tao tên class cho từng Cell Pokemon.
            setImg(pokemonCells, value);    // Tạo function setIMG cho pokemonCells.
            rowDiv.appendChild(pokemonCells);  // Đưa vào map.
        }
        map.appendChild(rowDiv);
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
