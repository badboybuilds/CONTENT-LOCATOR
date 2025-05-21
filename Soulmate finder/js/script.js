document.addEventListener('DOMContentLoaded', () => {
    const startQuizBtn = document.getElementById('startQuizBtn');
    const quizSection = document.getElementById('quizSection');
    const heroSection = document.querySelector('.hero-section');
    const resultSection = document.getElementById('resultSection');
    const questionContainer = document.getElementById('questionContainer');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const progressBar = document.getElementById('progressBar');
    const applyAgainBtn = document.getElementById('applyAgainBtn');

    const nonNegotiableToggle = document.getElementById('nonNegotiableToggle');
    const nonNegotiableWarningDiv = document.getElementById('nonNegotiableWarning');

    const lofiToggle = document.getElementById('lofiToggle');
    const lofiMusic = document.getElementById('lofiMusic');
    const musicIcon = document.getElementById('musicIcon');

    const foxMaskCursor = document.getElementById('foxMaskCursor');
    const foxMaskImg = foxMaskCursor.querySelector('img');

    const quizQuestions = [
        {
            question: "日本語を学び、JLPT N1に合格する意思はありますか？ <small>(Willing to learn Japanese and pass JLPT N1?)</small>",
            type: "radio",
            options: [{ text: "はい (Yes)", value: "yes" }, { text: "いいえ (No)", value: "no" }],
            nonNegotiable: true,
            failCondition: (val) => val === "no",
            points: 0 // Non-negotiable, no points directly but gates progress
        },
        {
            question: "時期が来たら日本に移住する意思はありますか？ <small>(Willing to move to Japan when the time comes?)</small>",
            type: "radio",
            options: [{ text: "はい (Yes)", value: "yes" }, { text: "いいえ (No)", value: "no" }],
            nonNegotiable: true,
            failCondition: (val) => val === "no",
            points: 0
        },
        {
            question: "ほとんどの時間を私にくれますか？ <small>(Will you give most of your time to me?)</small>",
            type: "radio",
            options: [{ text: "はい (Yes)", value: "yes", points: 10 }, { text: "いいえ (No)", value: "no", points: 0 }],
        },
        {
            question: "私を無視することはありますか？ <small>(Will you ever ignore me?)</small>",
            type: "radio",
            options: [{ text: "いいえ (No)", value: "no", points: 10 }, { text: "はい (Yes)", value: "yes", points: 0 }],
        },
        {
            question: "私に対して怒って話を無視することはありますか？ <small>(Will you ever get mad at me and stop talking to me?)</small>",
            type: "radio",
            options: [{ text: "いいえ (No)", value: "no" }, { text: "はい (Yes)", value: "yes" }],
            nonNegotiable: true,
            failCondition: (val) => val === "yes",
            points: 0
        },
        {
            question: "あなたの身長は？ <small>(What is your height?)</small>",
            type: "dropdown",
            options: [
                { text: "選択してください (Please select)", value: "" },
                { text: "140cm未満 (Below 140cm)", value: "140-" },
                { text: "140cm - 149cm", value: "140-149" },
                { text: "150cm - 159cm", value: "150-159" },
                { text: "160cm - 169cm", value: "160-169" },
                { text: "170cm - 179cm", value: "170-179" },
                { text: "180cm以上 (Above 180cm)", value: "180+" },
                { text: "気にしない/答えたくない (Don't care/Prefer not to say)", value: "dont_care" }
            ],
            pointsLogic: () => 0 // "Don't care" for scoring
        },
        {
            question: "ゲームをしたり本を読んだりするのは好きですか？ <small>(Do you like playing games or reading books?)</small>",
            type: "checkbox",
            options: [
                { text: "ゲーム (Playing games)", value: "games", points: 5 },
                { text: "読書 (Reading books)", value: "books", points: 5 }
            ],
            // Special scoring: +15 if both are selected
            pointsLogic: (selectedValues) => {
                if (selectedValues.length === 2) return 15;
                if (selectedValues.length === 1) return 5;
                return 0;
            }
        },
        {
            question: "美味しい料理が作れますか？ <small>(Can you cook tasty food?)</small>",
            type: "radio",
            options: [{ text: "はい (Yes)", value: "yes", points: 5 }, { text: "いいえ (No)", value: "no", points: 0 }],
        },
        {
            question: "結婚したら一緒にジムに行ってくれますか？ <small>(Will you go to the gym with me when we’re married?)</small>",
            type: "radio",
            options: [{ text: "はい (Yes)", value: "yes", points: 5 }, { text: "いいえ (No)", value: "no", points: 0 }],
        },
        {
            question: "完全な正直さと透明性をもって共に人生を築くことを信じますか？ <small>(Do you believe in building a life together with complete honesty and transparency?)</small>",
            type: "radio",
            options: [{ text: "はい (Yes)", value: "yes", points: 10 }, { text: "いいえ (No)", value: "no", points: 0 }],
        },
        {
            question: "私の夢（MIT、Google、日本など、どんな突飛なものでも）を応援してくれますか？ <small>(Will you support my dreams, even the wildest ones like MIT or Google or Japan?)</small>",
            type: "radio",
            options: [{ text: "はい (Yes)", value: "yes", points: 10 }, { text: "いいえ (No)", value: "no", points: 0 }],
        },
        {
            question: "精神的に自立していますか？ <small>(Are you emotionally independent?)</small>",
            type: "radio",
            options: [{ text: "はい (Yes)", value: "yes", points: 5 }, { text: "いいえ (No)", value: "no", points: -5 }],
        }
    ];

    let currentQuestionIndex = 0;
    let userAnswers = new Array(quizQuestions.length).fill(null);
    let totalScore = 0;
    const maxPossibleScore = quizQuestions.reduce((sum, q) => {
        if (q.pointsLogic) return sum + 15; // Max for checkbox question
        if (q.options) {
            const maxOptionPoints = Math.max(...q.options.map(opt => opt.points || 0));
            return sum + (maxOptionPoints > 0 ? maxOptionPoints : (q.nonNegotiable ? 0 : 0)); // Adjust based on how you want to calculate max score for non-point questions
        }
        return sum;
    }, 0);


    // --- Event Listeners ---
    startQuizBtn.addEventListener('click', startQuiz);
    nextBtn.addEventListener('click', handleNextQuestion);
    prevBtn.addEventListener('click', handlePrevQuestion);
    applyAgainBtn.addEventListener('click', restartQuiz);

    nonNegotiableToggle.addEventListener('change', () => {
        nonNegotiableWarningDiv.style.display = nonNegotiableToggle.checked ? 'block' : 'none';
    });

    lofiToggle.addEventListener('change', () => {
        if (lofiToggle.checked) {
            lofiMusic.play().catch(e => console.log("Autoplay prevented:", e));
            musicIcon.src = "assets/images/music_on_icon.png"; // Optional: change icon
        } else {
            lofiMusic.pause();
            musicIcon.src = "assets/images/music_off_icon.png"; // Optional: change icon
        }
    });
    // Allow music to play on first interaction if autoplay is blocked
    document.body.addEventListener('click', () => {
        if (lofiToggle.checked && lofiMusic.paused) {
            lofiMusic.play().catch(e => console.log("Autoplay still prevented:", e));
        }
    }, { once: true });


    // Animated Fox Cursor
    document.addEventListener('mousemove', (e) => {
        if (foxMaskImg.complete && foxMaskImg.naturalHeight !== 0) { // Check if image is loaded
             foxMaskCursor.style.left = e.pageX + 'px';
             foxMaskCursor.style.top = e.pageY + 'px';
             foxMaskCursor.style.transform = 'translate(-50%, -50%)'; // Center the image on cursor
             foxMaskImg.style.opacity = '1';
        }
    });
    document.addEventListener('mouseleave', () => {
        foxMaskImg.style.opacity = '0';
    });
     document.querySelectorAll('button, a, input, select, label').forEach(el => {
        el.addEventListener('mouseenter', () => foxMaskImg.style.opacity = '0');
        el.addEventListener('mouseleave', () => foxMaskImg.style.opacity = '1');
    });


    // --- Functions ---
    function startQuiz() {
        heroSection.style.display = 'none';
        nonNegotiableWarningDiv.style.display = nonNegotiableToggle.checked ? 'block' : 'none'; // Show warning if toggled
        quizSection.style.display = 'block';
        currentQuestionIndex = 0;
        userAnswers.fill(null);
        totalScore = 0;
        displayQuestion();
        updateProgressBar();
        prevBtn.style.display = 'none';
    }

    function displayQuestion() {
        const currentQuestion = quizQuestions[currentQuestionIndex];
        questionContainer.innerHTML = ''; // Clear previous question

        const questionText = document.createElement('h3');
        questionText.innerHTML = currentQuestion.question; // Use innerHTML for the <small> tag
        questionContainer.appendChild(questionText);

        const optionsDiv = document.createElement('div');
        optionsDiv.className = 'options';

        if (currentQuestion.type === "radio" || currentQuestion.type === "checkbox") {
            currentQuestion.options.forEach((option, index) => {
                const id = `q${currentQuestionIndex}_option${index}`;
                const wrapper = document.createElement('div');
                const input = document.createElement('input');
                input.type = currentQuestion.type;
                input.name = `q${currentQuestionIndex}`;
                input.id = id;
                input.value = option.value;

                if (userAnswers[currentQuestionIndex]) {
                    if (currentQuestion.type === "checkbox" && userAnswers[currentQuestionIndex].includes(option.value)) {
                        input.checked = true;
                    } else if (currentQuestion.type === "radio" && userAnswers[currentQuestionIndex] === option.value) {
                        input.checked = true;
                    }
                }

                const label = document.createElement('label');
                label.htmlFor = id;
                label.innerHTML = option.text; // Use innerHTML if option text might contain HTML
                wrapper.appendChild(input);
                wrapper.appendChild(label);
                optionsDiv.appendChild(wrapper);
            });
        } else if (currentQuestion.type === "dropdown") {
            const select = document.createElement('select');
            select.id = `q${currentQuestionIndex}`;
            currentQuestion.options.forEach(option => {
                const optElement = document.createElement('option');
                optElement.value = option.value;
                optElement.textContent = option.text;
                select.appendChild(optElement);
            });
            if (userAnswers[currentQuestionIndex]) {
                select.value = userAnswers[currentQuestionIndex];
            }
            optionsDiv.appendChild(select);
        }
        questionContainer.appendChild(optionsDiv);
        updateProgressBar();
        prevBtn.style.display = currentQuestionIndex > 0 ? 'inline-block' : 'none';
        nextBtn.textContent = (currentQuestionIndex === quizQuestions.length - 1) ? "結果を見る (See Results)" : "次へ (Next)";
    }

    function handleNextQuestion() {
        if (!saveAnswer()) return; // Validation or non-negotiable check failed

        currentQuestionIndex++;
        if (currentQuestionIndex < quizQuestions.length) {
            displayQuestion();
        } else {
            calculateAndShowResults();
        }
    }

    function handlePrevQuestion() {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            displayQuestion();
        }
    }

    function saveAnswer() {
        const currentQuestion = quizQuestions[currentQuestionIndex];
        let selectedValue;

        if (currentQuestion.type === "radio") {
            const selectedOption = document.querySelector(`input[name="q${currentQuestionIndex}"]:checked`);
            if (!selectedOption) {
                alert("選択してください。(Please make a selection.)");
                return false;
            }
            selectedValue = selectedOption.value;
            userAnswers[currentQuestionIndex] = selectedValue;

            if (currentQuestion.nonNegotiable && currentQuestion.failCondition(selectedValue)) {
                showAutoFail("nonNegotiable");
                return false; // Stop progression
            }

        } else if (currentQuestion.type === "checkbox") {
            const checkedOptions = Array.from(document.querySelectorAll(`input[name="q${currentQuestionIndex}"]:checked`))
                                       .map(cb => cb.value);
            selectedValue = checkedOptions;
            userAnswers[currentQuestionIndex] = selectedValue;
            // No non-negotiable for checkbox in this setup, but could be added

        } else if (currentQuestion.type === "dropdown") {
            selectedValue = document.getElementById(`q${currentQuestionIndex}`).value;
            if (selectedValue === "") {
                alert("選択してください。(Please make a selection.)");
                return false;
            }
            userAnswers[currentQuestionIndex] = selectedValue;
            // No non-negotiable for dropdown in this setup
        }
        return true; // Answer saved successfully
    }

    function showAutoFail(reason) {
        quizSection.style.display = 'none';
        resultSection.innerHTML = `
            <div class="auto-fail-message">
                <h2>残念ながら... (Unfortunately...)</h2>
                <p>今回はご縁がなかったようです。あなたの回答が、いくつかの「譲れない条件」と一致しませんでした。</p>
                <p>(It seems we weren't a match this time. Your answer to a non-negotiable question was not compatible.)</p>
                <button id="applyAgainBtnFail" class="cta-button">もう一度試す <img src="assets/images/refresh_icon.png" alt="" class="icon"></button>
            </div>`;
        resultSection.style.display = 'block';
        document.getElementById('applyAgainBtnFail').addEventListener('click', restartQuiz);
        stopCherryBlossomAnimation(); // Ensure no blossoms on fail screen
    }


    function calculateAndShowResults() {
        totalScore = 0;
        let nonNegotiableFailed = false;

        quizQuestions.forEach((question, index) => {
            const answer = userAnswers[index];
            if (question.nonNegotiable && question.failCondition && question.failCondition(answer)) {
                nonNegotiableFailed = true; // This should ideally be caught earlier
                return;
            }

            if (question.pointsLogic) { // For complex scoring like checkboxes
                totalScore += question.pointsLogic(answer);
            } else if (question.type === "radio" || question.type === "dropdown") {
                const selectedOptionDetails = question.options.find(opt => opt.value === answer);
                if (selectedOptionDetails && selectedOptionDetails.points) {
                    totalScore += selectedOptionDetails.points;
                } else if (question.points && answer === "yes") { // Simplified fallback if points on question itself
                    totalScore += question.points;
                }
            }
        });

        if (nonNegotiableFailed) { // Double check, though should be caught by saveAnswer
            showAutoFail("nonNegotiableFinalCheck");
            return;
        }

        quizSection.style.display = 'none';
        resultSection.style.display = 'block';
        nonNegotiableWarningDiv.style.display = 'none'; // Hide warning on results

        // Ensure result section is cleared for new results if retaking
        document.getElementById('resultTitle').textContent = '';
        document.getElementById('compatibilityScore').textContent = '';
        document.getElementById('poeticMessage').textContent = '';
        document.getElementById('resultAnimation').innerHTML = '<img src="assets/images/matching_hearts.gif" alt="Matching Hearts" style="display:none;">';


        const percentage = Math.max(0, Math.min(100, Math.round((totalScore / maxPossibleScore) * 100)));
        console.log("Total Score:", totalScore, "Max Possible Score:", maxPossibleScore, "Percentage:", percentage);


        document.getElementById('resultTitle').textContent = "あなたの相性結果は...";
        document.getElementById('compatibilityScore').textContent = `${percentage}%`;

        let message = "";
        if (percentage >= 90) {
            message = "あなたは私の春に咲く桜のようです！運命を感じます。 (You’re the Sakura to my Spring! I feel a strong connection.)";
            document.querySelector('#resultAnimation img').style.display = 'block'; // Show heart animation
        } else if (percentage >= 75) {
            message = "まるで満開の桜並木を一緒に歩いているみたい。素晴らしい相性ですね！ (Like walking through a cherry blossom lane together. We're very compatible!)";
        } else if (percentage >= 60) {
            message = "そよ風に舞う桜の花びらのよう。もっとお互いを知るのが楽しみです。 (Like a cherry petal dancing in the breeze. I'm excited to know you more.)";
        } else if (percentage >= 40) {
            message = "初桜のつぼみ。まだこれからですが、可能性を感じます。 (A first cherry blossom bud. There's potential blooming.)";
        } else {
            message = "今はまだ冬の木々。でも、春は必ずやってきます。 (Like trees in winter now, but spring always comes.)";
        }
        document.getElementById('poeticMessage').textContent = message;

        startCherryBlossomAnimation();
        // Ensure Apply Again button is correctly wired here if resultSection was rebuilt
        document.getElementById('applyAgainBtn').style.display = 'block';
        if (!document.getElementById('applyAgainBtn').getAttribute('listener')) {
            document.getElementById('applyAgainBtn').addEventListener('click', restartQuiz);
            document.getElementById('applyAgainBtn').setAttribute('listener', 'true');
        }

    }

    function updateProgressBar() {
        const progress = ((currentQuestionIndex +1) / quizQuestions.length) * 100;
        progressBar.style.width = `${progress}%`;
    }

    function restartQuiz() {
        resultSection.style.display = 'none';
        stopCherryBlossomAnimation();
        heroSection.style.display = 'block'; // Or go straight to quiz: startQuiz();
        // If going straight to quiz:
        // startQuiz();
    }

    // --- Cherry Blossom Animation ---
    const blossomContainer = document.querySelector('.cherry-blossom-animation');
    let blossomInterval;

    function createPetal() {
        if (!blossomContainer) return;
        const petal = document.createElement('div');
        petal.classList.add('sakura-petal');
        petal.style.left = Math.random() * 100 + '%';
        petal.style.animationDuration = (Math.random() * 3 + 2) + 's'; // 2-5 seconds fall
        petal.style.animationDelay = Math.random() * 1 + 's'; // Stagger start
        petal.style.opacity = Math.random() * 0.5 + 0.5; // Vary opacity
        petal.style.transform = `scale(${Math.random() * 0.5 + 0.5})`; // Vary size
        blossomContainer.appendChild(petal);

        setTimeout(() => {
            petal.remove();
        }, 5000); // Remove after animation + buffer
    }

    function startCherryBlossomAnimation() {
        if (!blossomContainer) return;
        blossomContainer.innerHTML = ''; // Clear old petals
        for (let i = 0; i < 15; i++) { // Create an initial burst
            setTimeout(createPetal, Math.random() * 1000);
        }
        blossomInterval = setInterval(createPetal, 300); // Add new petals regularly
    }

    function stopCherryBlossomAnimation() {
        clearInterval(blossomInterval);
        if (blossomContainer) blossomContainer.innerHTML = ''; // Clear remaining petals
    }

    // Initial setup for warning toggle
    nonNegotiableWarningDiv.style.display = nonNegotiableToggle.checked ? 'block' : 'none';

    // Placeholder for icons (if you decide to load them via JS, otherwise use HTML)
    // document.getElementById('startQuizBtn').innerHTML += ' <img src="assets/images/heart_arrow_icon.png" alt="" class="icon">';
    // document.getElementById('applyAgainBtn').innerHTML += ' <img src="assets/images/refresh_icon.png" alt="" class="icon">';
    // musicIcon.src = "assets/images/music_off_icon.png";

    // Preload fox mask image to prevent initial flicker
    const imgPreload = new Image();
    imgPreload.src = "assets/images/fox_mask_cursor.png";
    imgPreload.onload = () => {
        console.log("Fox mask cursor image preloaded.");
    };


});