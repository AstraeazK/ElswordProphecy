let systemPos = null;
let systemNum = null;
let isSecondInput = false;
let allNumbers = [];
let correctAnswer = [];
let resultDiv = null;
let selectedProphecy = null;
let usedProphecies = [];
let countdownInterval = null;
let timeRemaining = 100;
let currentRound = 0;
let currentLanguage = "th";

function toggleLanguage() {
  currentLanguage = currentLanguage === "th" ? "en" : "th";
  applyLanguage();
}

function setLanguage(lang) {
  currentLanguage = lang;
  
  applyLanguage();
}

function applyLanguage() {
  const title = document.getElementById("title");
  const generateBtn = document.querySelector("button[onclick='generate()']");
  const pickPicture = document.getElementById("inputLabel");

  if (currentLanguage === "th") {
    title.innerText = "คำทำนาย";
    generateBtn.innerText = "สุ่มคำทำนาย";
    pickPicture.innerText = "เลือกรูปภาพที่เป็นคำตอบให้ถูกต้อง";

  } else {
    title.innerText = "Prophecy";
    generateBtn.innerText = "Start";
    pickPicture.innerText = "Choose the correct symbol";
  }

  if (selectedProphecy) updateProphecyUI(selectedProphecy);
}

const prophecyList = [
  { th: "จุดเดียว ความโดดเดี่ยวแต่เป็นเสาหลักแห่งจุดเริ่มต้นที่่สมบูรณ์", 
    en: "This is a single point. A lonely solitude, but a complete pillar of beginning.", 
    position: 0 },
  { th: "แสงและความมืด ตัวข้าและผู้อื่น ความถูกต้องและความผิด เมื่อยืนอยู่หน้าทางแยกสองทาง ความขัดแย้งและการต่อต้านเริ่มต้นขึ้น", 
    en: "Light and Dark, self and others, right and wrong. All conflict sprouts from two forks in the path." , 
    position: 1 },
  { th: "อาาา...นี่คือตรีเอกานุภาพ ความสมบูรณ์แบบสูงสุด จุดเริ่มต้นของมิติหลายมิติและการเริ่มต้นของ 'ทั้งหมด'", 
    en: "Aaaa... This is the trinity, the ultimate perfection. The beginning of multi-dimensions and the start of 'ALL'.",
    position: 2 },
  { th: "สี่เหลียมที่เป็นหมายเลขของความมั่นคงและความปลอดภัยที่จะเปิดเส้นทางสู่การสำเร็จอย่างกลมกลืน", 
    en: "The quadrilateral number of stability and security that will open the road to harmonic completion.",
    position: 3 },
  { th: "ดาวที่เปล่งประกาย เขาทั้งห้า ผู้ที่แสวงหาอำนาจจะต้องระวังการเสื่อมทราม", 
    en: "The shining star, the five horns. Those who seek power must be wary of corruption.",
    position: 4 },
  { th: "หมายเลขสูงสุดบนลูกเต๋าที่รู้จักกันในชื่อหมายเลขปีศาจ ฉันสงสัยว่าชะตาจะพาคุณไปที่ไหน", 
    en: "The highest number on a dice also known as a demonic number. I wonder where the fate would take you?",
    position: 5 }
];

function startCountdown() {
  clearInterval(countdownInterval);
  timeRemaining = 100;

  updateCountdownDisplay();

  countdownInterval = setInterval(() => {
    timeRemaining--;
    updateCountdownDisplay();

    if (timeRemaining <= 0) {
      clearInterval(countdownInterval);
      endGame(false, "⏰ หมดเวลา!");
    }
  }, 1000);
}

function updateCountdownDisplay() {
  const mins = String(Math.floor(timeRemaining / 60)).padStart(2, "0");
  const secs = String(timeRemaining % 60).padStart(2, "0");
  document.getElementById("countdown").innerText = `⌛️ ${mins}:${secs}`;
}

function stopCountdown() {
  clearInterval(countdownInterval);
}

function endGame(isWin, message) {
  resultDiv.innerHTML += `<p>${message}</p>`;
  resultDiv.scrollTop = resultDiv.scrollHeight;
  document.getElementById("userInput").disabled = true;
  document.getElementById("userInput").style.opacity = 0.5;
  document.getElementById("answerContainer").innerHTML = "";
  document.getElementById("prophecyBox").style.display = "none";
}

function generate() {
  const boxes = document.getElementById("symbolBoxes").children;

  document.getElementById("userInput").disabled = false;
  document.getElementById("userInput").style.opacity = 1;
  document.getElementById("prophecyBox").style.display = "none";
  document.getElementById("prophecyBox").style.opacity = 0;
  document.getElementById("answerContainer").innerHTML = "";

  for (let i = 0; i < boxes.length; i++) {
    boxes[i].src = "Symbol_none.png";
  }

  systemPos = Math.floor(Math.random() * 6);
  systemNum = Math.floor(Math.random() * 8) + 1;
  boxes[systemPos].src = `Symbol_${systemNum}.png`;
  document.getElementById("inputContainer").style.display = "block";
  document.getElementById("userInput").value = "";

  if (currentLanguage === "th") {
    document.getElementById("userInput").placeholder = "ตัวอย่าง: - - - 8 - -";
    document.getElementById("inputLabel").innerText = "พิมพ์ตัวเลขและตำแหน่ง";
  } else {
    document.getElementById("userInput").placeholder = "e.g. : - - - 8 - -";
    document.getElementById("inputLabel").innerText = "Enter number and positions";
  }
  document.getElementById("resultContainer").innerHTML = "";

  isSecondInput = false;
  allNumbers = [];
  correctAnswer = [];
  usedProphecies = [];
  currentRound = 0;
  startCountdown();
}

function fadeOut(element, duration = 500) {
  element.style.transition = `opacity ${duration}ms`;
  element.style.opacity = 0;
  return new Promise((resolve) => {
    setTimeout(() => {
      element.style.display = "none";
      resolve();
    }, duration);
  });
}

function fadeIn(element, duration = 500) {
  element.style.display = "block";
  element.style.transition = `opacity ${duration}ms`;
  setTimeout(() => {
    element.style.opacity = 1;
  }, 20);
}


function getNextProphecy() {
  if (usedProphecies.length >= prophecyList.length) {
    return null;
  }

  let nextProphecy = null;
  do {
    nextProphecy = prophecyList[Math.floor(Math.random() * prophecyList.length)];
  } while (usedProphecies.includes(nextProphecy.position));

  usedProphecies.push(nextProphecy.position);
  currentRound++;
  return nextProphecy;
}

window.onload = function () {
  applyLanguage();
};

function updateProphecyUI(prophecy) {
  const prophecyBox = document.getElementById("prophecyBox");
  prophecyBox.innerHTML = currentLanguage === "th"
      ? `บัดนี้... ข้าจะนำทางเจ้าไปยังเส้นทางที่ถูกต้อง<br><br>${prophecy.th}`
      : `Now... I'll guide you to the right path.<br><br>${prophecy.en}`;
  prophecyBox.style.display = "block";
  prophecyBox.style.opacity = 0;
  setTimeout(() => {
    prophecyBox.style.opacity = 1;
  }, 50);

  const answerDiv = document.getElementById("answerContainer");
  answerDiv.innerHTML = "";

  const upperRow = document.createElement("div");
  const lowerRow = document.createElement("div");

  upperRow.style.display = "flex";
  upperRow.style.justifyContent = "center";
  upperRow.style.gap = "30px";
  upperRow.style.marginTop = "20px";
  upperRow.style.marginBottom = "20px";

  lowerRow.style.display = "flex";
  lowerRow.style.justifyContent = "center";
  lowerRow.style.gap = "30px";

  const allImages = [];

  for (let i = 1; i <= 4; i++) {
    const img = document.createElement("img");
    img.src = `Answer_${i}.png`;
    img.className = "symbol-answer";
    img.alt = `Answer ${i}`;
    img.style.cursor = "pointer";
    img.style.opacity = 0;
    img.addEventListener("click", onImageClick);
    upperRow.appendChild(img);
    allImages.push(img);
  }

  for (let i = 5; i <= 8; i++) {
    const img = document.createElement("img");
    img.src = `Answer_${i}.png`;
    img.className = "symbol-answer";
    img.alt = `Answer ${i}`;
    img.style.cursor = "pointer";
    img.style.opacity = 0;
    img.addEventListener("click", onImageClick);
    lowerRow.appendChild(img);
    allImages.push(img);
  }

  answerDiv.appendChild(upperRow);
  answerDiv.appendChild(lowerRow);

  setTimeout(() => {
    allImages.forEach(img => {
      img.style.opacity = 1;
    });
  }, 100);
}


function onImageClick(event) {
  const selectedNum = parseInt(event.target.alt.split(" ")[1]);
  const correctPos = selectedProphecy.position;
  const correctNum = correctAnswer[correctPos];

  const isCorrect = selectedNum === correctNum;
  const resultText = document.getElementById("resultContainer");
  const inputBox = document.getElementById("userInput");
  const prophecyBox = document.getElementById("prophecyBox");

  if (isCorrect) {
    if (currentLanguage === "th") {
      resultText.innerHTML += `<p>Computer Round [${currentRound}]: ✅ ถูกต้อง ตำแหน่งที่ ${correctPos + 1} เลข ${correctNum}</p>`;
    } else {
      resultText.innerHTML += `<p>Computer Round [${currentRound}]: ✅ Correct! Position ${correctPos + 1}, Number ${correctNum}</p>`;
    }
    resultText.scrollTop = resultText.scrollHeight;

    fadeOut(prophecyBox).then(() => {
      if (currentRound < 6) {
        setTimeout(() => {
          selectedProphecy = getNextProphecy();
          if (selectedProphecy) {
            updateProphecyUI(selectedProphecy);
            fadeIn(prophecyBox);
            inputBox.disabled = false;
            inputBox.value = "";
            inputBox.style.opacity = 1;
          }
        }, 300);
      } else {
        setTimeout(() => {
          if (currentLanguage === "th") {
            resultText.innerHTML += `<p>🎉 หวังว่าจะเข้าใจมากยิ่งขึ้นนะ 🎉</p>`;
          } else {
            resultText.innerHTML += `<p>🎉 Hope understand better now 🎉</p>`;
          }
          resultText.scrollTop = resultText.scrollHeight;
          prophecyBox.style.display = "none";
          document.getElementById("answerContainer").innerHTML = "";
          inputBox.disabled = true;
          inputBox.style.opacity = 0.5;
          stopCountdown();
        }, 300);
      }
    });
  } else {
    stopCountdown();
    if (currentLanguage === "th") {
      resultText.innerHTML += `<p>Computer Round [${currentRound}]: ❌ ผิด ตำแหน่งที่ ${correctPos + 1} ควรเป็นเลข ${correctNum}</p>`;
      resultText.innerHTML += `<p>💭 ลองทบทวนดูใหม่นะ...</p>`;
    } else {
      resultText.innerHTML += `<p>Computer Round [${currentRound}]: ❌ Wrong! Position ${correctPos + 1} should be ${correctNum}</p>`;
      resultText.innerHTML += `<p>💭 Try reviewing again...</p>`;
    }
    resultText.scrollTop = resultText.scrollHeight;

    inputBox.disabled = true;
    inputBox.style.opacity = 0.5;
    document.getElementById("answerContainer").innerHTML = "";
    prophecyBox.style.display = "none";
  }
}



document.addEventListener("DOMContentLoaded", () => {
  resultDiv = document.getElementById("resultContainer");

  document.getElementById("userInput").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      const input = this.value.trim();
      if (!input) return;

      if (!isSecondInput) {
        if (currentLanguage === "th") {
              resultDiv.innerHTML += `<p><strong>ผู้เล่น :</strong> ${input}</p>`;
            } else {
              resultDiv.innerHTML += `<p><strong>Player :</strong> ${input}</p>`;
            }

        const usedPos = new Set([systemPos]);
        const usedNums = new Set([systemNum]);
        let rowData = Array(6).fill("-");
        rowData[systemPos] = systemNum;
        allNumbers.push(systemNum);
        correctAnswer = Array(6).fill(null);
        correctAnswer[systemPos] = systemNum;

        for (let i = 1; i <= 5; i++) {
          let pos, num;
          do {
            pos = Math.floor(Math.random() * 6);
          } while (usedPos.has(pos));
          usedPos.add(pos);

          do {
            num = Math.floor(Math.random() * 8) + 1;
          } while (usedNums.has(num));
          usedNums.add(num);

          let row = Array(6).fill("-");
          row[pos] = num;
          if (currentLanguage === "th") {
              resultDiv.innerHTML += `<p><strong>เพื่อน [${i}] :</strong> ${row.join(" ")}</p>`;
            } else {
              resultDiv.innerHTML += `<p><strong>Friend [${i}] :</strong> ${row.join(" ")}</p>`;
            }
          allNumbers.push(num);
          correctAnswer[pos] = num;
        }

        this.value = "";
        if (currentLanguage === "th") {
              document.getElementById("inputLabel").innerText = "รวมเลขทั้งหมด";
              this.placeholder = "ตัวอย่าง: 3 4 6 5 7 1";
            } else {
              document.getElementById("inputLabel").innerText = "Gather numbers";
              this.placeholder = "e.g.: 3 4 6 5 7 1";
            }
        isSecondInput = true;

      } else {
        if (currentLanguage === "th") {
              document.getElementById("inputLabel").innerText = "เลือกรูปภาพที่เป็นคำตอบให้ถูกต้อง";
              resultDiv.innerHTML += `<p><strong>ผู้เล่น :</strong> ${input}</p>`;
            } else {
              document.getElementById("inputLabel").innerText = "Choose the correct symbol";
              resultDiv.innerHTML += `<p><strong>Player :</strong> ${input}</p>`;
            }
        this.disabled = true;
        this.style.opacity = 0.5;

        if (currentRound === 0) {
          selectedProphecy = getNextProphecy();
          if (selectedProphecy) {
            updateProphecyUI(selectedProphecy);
          }
        }
      }
    }
  });
});
