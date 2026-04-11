(function () {
  "use strict";

  // ─── Navigation ────────────────────────────────────────────────────
  const navButtons = document.querySelectorAll(".nav-btn");
  const pages = document.querySelectorAll(".page");

  function showPage(pageId) {
    pages.forEach(function (p) {
      p.classList.remove("active");
    });
    navButtons.forEach(function (b) {
      b.classList.remove("active");
      b.removeAttribute("aria-current");
    });
    var target = document.getElementById("page-" + pageId);
    if (target) {
      target.classList.add("active");
    }
    navButtons.forEach(function (b) {
      if (b.dataset.page === pageId) {
        b.classList.add("active");
        b.setAttribute("aria-current", "page");
      }
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  navButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      showPage(btn.dataset.page);
    });
  });

  // Feature card navigation on home page
  document.querySelectorAll("[data-navigate]").forEach(function (card) {
    card.addEventListener("click", function () {
      showPage(card.dataset.navigate);
    });
  });

  // ─── Font Size Controls ────────────────────────────────────────────
  var currentFontSize = 100; // percentage
  var MIN_FONT = 90;
  var MAX_FONT = 150;
  var STEP = 10;

  document.getElementById("font-increase").addEventListener("click", function () {
    if (currentFontSize < MAX_FONT) {
      currentFontSize += STEP;
      document.documentElement.style.fontSize = currentFontSize + "%";
    }
  });

  document.getElementById("font-decrease").addEventListener("click", function () {
    if (currentFontSize > MIN_FONT) {
      currentFontSize -= STEP;
      document.documentElement.style.fontSize = currentFontSize + "%";
    }
  });

  // ─── Pirate Name Generator ────────────────────────────────────────
  var pirateFirstNames = [
    "Captain", "Admiral", "Commodore", "Scallywag", "Buccaneer",
    "Salty", "Red", "Barnacle", "Pegleg", "One-Eyed",
    "Jolly", "Dread", "Iron", "Stormy", "Rusty",
    "Silver", "Mad", "Lucky", "Grizzled", "Fearless",
    "Cutlass", "Broadside", "Old", "Whiskered", "Crafty"
  ];

  var pirateMiddleNames = [
    "Blackbeard", "Bones", "Plank", "Anchor", "Compass",
    "Cannon", "Reef", "Thunder", "Doubloon", "Dagger",
    "Kraken", "Parrot", "Tide", "Grog", "Barrel",
    "Mast", "Sail", "Shark", "Treasure", "Gale",
    "Flintlock", "Powder", "Wave", "Rum", "Crow"
  ];

  var pirateLastNames = [
    "of the Seven Seas", "McPlunder", "Swashbuckler", "the Terrible",
    "the Magnificent", "Seadog", "Corsair", "the Bold",
    "Scourge of the Seas", "the Fearsome", "Raider of Ships",
    "the Legendary", "Treasure Hunter", "Storm Chaser",
    "the Wise", "the Cunning", "Sea Rover", "the Adventurer",
    "of Skull Island", "the Undefeated", "the Daring",
    "Wave Rider", "Ship Sinker", "the Retired", "the Distinguished"
  ];

  var pirateTitles = [
    "Terror of the Caribbean",
    "Master of the High Seas",
    "Keeper of the Treasure Map",
    "Guardian of the Rum Barrel",
    "Scourge of the Seven Seas",
    "Lord of the Crow's Nest",
    "Protector of Parrot Island",
    "Commander of the Ghost Ship",
    "Ruler of the Pirate Cove",
    "Champion of the Cannon Deck"
  ];

  function hashString(str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash = hash & hash;
    }
    return Math.abs(hash);
  }

  function generatePirateName(firstName, lastName) {
    var combined = (firstName + lastName).toLowerCase().trim();
    if (combined.length === 0) {
      return null;
    }
    var hash = hashString(combined);
    var pFirst = pirateFirstNames[hash % pirateFirstNames.length];
    var pMiddle = pirateMiddleNames[(hash * 7) % pirateMiddleNames.length];
    var pLast = pirateLastNames[(hash * 13) % pirateLastNames.length];
    var title = pirateTitles[(hash * 3) % pirateTitles.length];
    return {
      name: pFirst + " " + pMiddle + " " + pLast,
      title: title
    };
  }

  var generateBtn = document.getElementById("generate-name-btn");
  var resultBox = document.getElementById("pirate-name-result");
  var nameOutput = document.getElementById("pirate-name-output");
  var titleOutput = document.getElementById("pirate-name-title");
  var firstInput = document.getElementById("first-name");
  var lastInput = document.getElementById("last-name");

  generateBtn.addEventListener("click", function () {
    var result = generatePirateName(firstInput.value, lastInput.value);
    if (!result) {
      firstInput.focus();
      return;
    }
    nameOutput.textContent = result.name;
    titleOutput.textContent = '"' + result.title + '"';
    resultBox.hidden = false;
    resultBox.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  document.getElementById("generate-another-btn").addEventListener("click", function () {
    firstInput.value = "";
    lastInput.value = "";
    resultBox.hidden = true;
    firstInput.focus();
  });

  // ─── Jokes & Stories ──────────────────────────────────────────────
  var jokes = [
    { setup: "Why did the pirate go to school?", punchline: "To improve his arrrticulation!" },
    { setup: "What's a pirate's favorite letter?", punchline: "You'd think it's R, but it's really the C!" },
    { setup: "How do pirates prefer to communicate?", punchline: "Aye to aye!" },
    { setup: "What did the ocean say to the pirate?", punchline: "Nothing, it just waved!" },
    { setup: "Why couldn't the pirate play cards?", punchline: "Because he was standing on the deck!" },
    { setup: "What's a pirate's favorite type of exercise?", punchline: "The plank!" },
    { setup: "Where do pirates put their trash?", punchline: "In the garrrbage can!" },
    { setup: "What's a pirate's favorite country?", punchline: "Arrrgentina!" },
    { setup: "Why did the pirate take a bath?", punchline: "To wash up on shore!" },
    { setup: "What does a pirate wear in the fall?", punchline: "A pumpkin patch!" },
    { setup: "How much did the pirate pay for his earrings?", punchline: "About a buck an ear!" },
    { setup: "What do you call a pirate who skips class?", punchline: "Captain Hooky!" },
    { setup: "What's a pirate's favorite letter of the alphabet?", punchline: "P! Because it's like an R but missing a leg!" },
    { setup: "Why do pirates make great singers?", punchline: "They can hit the high Cs!" },
    { setup: "What did the pirate say on his 80th birthday?", punchline: "Aye matey! (I'm eighty!)" },
    { setup: "Why did the pirate refuse to say 'Aye Aye'?", punchline: "Because he had an eye patch and could only say 'Aye'!" },
    { setup: "What's a pirate's favorite part of a song?", punchline: "The hook!" },
    { setup: "What lies at the bottom of the ocean and twitches?", punchline: "A nervous wreck!" },
    { setup: "What do pirates charge for corn?", punchline: "A buck-an-ear!" },
    { setup: "Why did nobody want to play cards with the pirate?", punchline: "Because he was always standing on the deck!" }
  ];

  var currentJokeIndex = 0;
  var jokeSetup = document.getElementById("joke-setup");
  var jokePunchline = document.getElementById("joke-punchline");
  var revealBtn = document.getElementById("reveal-punchline-btn");
  var nextJokeBtn = document.getElementById("next-joke-btn");

  function shuffleArray(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
    return arr;
  }

  shuffleArray(jokes);

  function showJoke(index) {
    jokeSetup.textContent = jokes[index].setup;
    jokePunchline.textContent = jokes[index].punchline;
    jokePunchline.hidden = true;
    revealBtn.hidden = false;
    revealBtn.disabled = false;
  }

  showJoke(0);

  revealBtn.addEventListener("click", function () {
    jokePunchline.hidden = false;
    revealBtn.hidden = true;
    jokePunchline.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  nextJokeBtn.addEventListener("click", function () {
    currentJokeIndex = (currentJokeIndex + 1) % jokes.length;
    if (currentJokeIndex === 0) {
      shuffleArray(jokes);
    }
    showJoke(currentJokeIndex);
  });

  // ─── Trivia Quiz ──────────────────────────────────────────────────
  var triviaQuestions = [
    {
      question: "What was the name of the famous pirate flag with a skull and crossbones?",
      answers: ["The Jolly Roger", "The Death Banner", "The Skull Standard", "The Bone Flag"],
      correct: 0,
      explanation: "The Jolly Roger is the traditional name for the black flag with a skull and crossbones, used by pirates to strike fear into their enemies."
    },
    {
      question: "Which real pirate's name was Edward Teach?",
      answers: ["Captain Kidd", "Blackbeard", "Calico Jack", "Henry Morgan"],
      correct: 1,
      explanation: "Blackbeard's real name was Edward Teach (or Thatch). He terrorized the seas from 1716 to 1718."
    },
    {
      question: "What is the term for a pirate's share of stolen goods?",
      answers: ["Plunder portion", "Booty split", "Loot", "Fair share"],
      correct: 2,
      explanation: "Loot refers to stolen goods. Pirates divided their loot according to strict codes of conduct."
    },
    {
      question: "Which sea was most commonly associated with pirates in the 17th-18th centuries?",
      answers: ["Mediterranean Sea", "South China Sea", "Caribbean Sea", "North Sea"],
      correct: 2,
      explanation: "The Caribbean Sea during the 'Golden Age of Piracy' (roughly 1650-1730) was the most famous pirate territory."
    },
    {
      question: "What was a 'Letter of Marque'?",
      answers: ["A treasure map", "A government license to attack enemy ships", "A pirate's will", "A love letter from shore"],
      correct: 1,
      explanation: "A Letter of Marque was a government-issued license that allowed private citizens to attack enemy vessels during wartime, making them 'privateers' rather than pirates."
    },
    {
      question: "What is the 'crow's nest' on a ship?",
      answers: ["Where birds are kept", "A lookout platform near the top of the mast", "The captain's quarters", "A storage area below deck"],
      correct: 1,
      explanation: "The crow's nest is a lookout platform near the top of a ship's mast, used to spot land, other ships, or dangers ahead."
    },
    {
      question: "What is 'walking the plank'?",
      answers: ["A type of pirate dance", "A woodworking technique", "A punishment where victims walk off a board into the sea", "A balance exercise for sailors"],
      correct: 2,
      explanation: "Walking the plank was a form of punishment where a person was forced to walk off a wooden board extending over the side of the ship into the ocean."
    },
    {
      question: "Who was Anne Bonny?",
      answers: ["A fictional pirate from a novel", "One of the most famous female pirates", "A pirate ship builder", "A naval officer who caught pirates"],
      correct: 1,
      explanation: "Anne Bonny was one of the most famous female pirates in history, active in the Caribbean during the early 18th century alongside Calico Jack Rackham."
    },
    {
      question: "What did pirates call their alcoholic drink made from rum, water, sugar, and citrus?",
      answers: ["Pirate punch", "Grog", "Sea swill", "Buccaneer brew"],
      correct: 1,
      explanation: "Grog was a mixture of rum and water, often with sugar and lime. It was introduced by the Royal Navy to prevent scurvy and reduce drunkenness."
    },
    {
      question: "What is 'Davy Jones' Locker'?",
      answers: ["A famous pirate's treasure chest", "A term for the bottom of the sea", "A real storage locker in a museum", "A pirate tavern"],
      correct: 1,
      explanation: "Davy Jones' Locker is a phrase meaning the bottom of the sea — the final resting place of drowned sailors and sunken ships."
    }
  ];

  var quizState = {
    currentQuestion: 0,
    score: 0,
    answers: [],
    shuffledQuestions: []
  };

  var quizIntro = document.getElementById("quiz-intro");
  var quizArea = document.getElementById("quiz-area");
  var quizResults = document.getElementById("quiz-results");
  var quizQuestion = document.getElementById("quiz-question");
  var quizAnswers = document.getElementById("quiz-answers");
  var quizFeedback = document.getElementById("quiz-feedback");
  var quizProgressText = document.getElementById("quiz-progress-text");
  var progressFill = document.getElementById("progress-fill");
  var nextQuestionBtn = document.getElementById("next-question-btn");

  function startQuiz() {
    quizState.currentQuestion = 0;
    quizState.score = 0;
    quizState.answers = [];
    quizState.shuffledQuestions = shuffleArray(triviaQuestions.slice());
    quizIntro.hidden = true;
    quizResults.hidden = true;
    quizArea.hidden = false;
    showQuestion();
  }

  function showQuestion() {
    var q = quizState.shuffledQuestions[quizState.currentQuestion];
    var num = quizState.currentQuestion + 1;
    var total = quizState.shuffledQuestions.length;
    quizProgressText.textContent = "Question " + num + " of " + total;
    progressFill.style.width = (num / total * 100) + "%";
    quizQuestion.textContent = q.question;
    quizAnswers.innerHTML = "";
    quizFeedback.hidden = true;
    nextQuestionBtn.hidden = true;

    q.answers.forEach(function (answer, index) {
      var btn = document.createElement("button");
      btn.className = "answer-btn";
      btn.textContent = answer;
      btn.addEventListener("click", function () {
        selectAnswer(index);
      });
      quizAnswers.appendChild(btn);
    });
  }

  function selectAnswer(selectedIndex) {
    var q = quizState.shuffledQuestions[quizState.currentQuestion];
    var buttons = quizAnswers.querySelectorAll(".answer-btn");
    var isCorrect = selectedIndex === q.correct;

    buttons.forEach(function (btn, i) {
      btn.disabled = true;
      if (i === q.correct) {
        btn.classList.add("correct");
      } else if (i === selectedIndex && !isCorrect) {
        btn.classList.add("wrong");
      }
    });

    if (isCorrect) {
      quizState.score++;
      quizFeedback.textContent = "Correct! " + q.explanation;
      quizFeedback.className = "quiz-feedback correct";
    } else {
      quizFeedback.textContent = "Not quite! " + q.explanation;
      quizFeedback.className = "quiz-feedback wrong";
    }

    quizState.answers.push({
      question: q.question,
      selected: selectedIndex,
      correct: q.correct,
      isCorrect: isCorrect
    });

    quizFeedback.hidden = false;
    nextQuestionBtn.hidden = false;
    quizFeedback.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  nextQuestionBtn.addEventListener("click", function () {
    quizState.currentQuestion++;
    if (quizState.currentQuestion < quizState.shuffledQuestions.length) {
      showQuestion();
      quizQuestion.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      showResults();
    }
  });

  function showResults() {
    quizArea.hidden = true;
    quizResults.hidden = false;
    var total = quizState.shuffledQuestions.length;
    var score = quizState.score;
    document.getElementById("quiz-score").textContent =
      "You scored " + score + " out of " + total + "!";

    var rank;
    if (score === total) {
      rank = "Legendary Pirate Captain! Perfect score!";
    } else if (score >= total * 0.8) {
      rank = "First Mate material! Excellent knowledge!";
    } else if (score >= total * 0.6) {
      rank = "Seasoned Deckhand! Good showing!";
    } else if (score >= total * 0.4) {
      rank = "Cabin Boy! Keep studying your pirate lore!";
    } else {
      rank = "Landlubber! Time to hit the pirate books!";
    }
    document.getElementById("quiz-rank").textContent = rank;

    var reviewHtml = "<h4>Review Your Answers:</h4>";
    quizState.answers.forEach(function (a, i) {
      var q = quizState.shuffledQuestions[i];
      var icon = a.isCorrect ? "&#x2705;" : "&#x274C;";
      reviewHtml += '<div class="review-item ' + (a.isCorrect ? "review-correct" : "review-wrong") + '">';
      reviewHtml += "<p><strong>" + icon + " " + q.question + "</strong></p>";
      if (!a.isCorrect) {
        reviewHtml += '<p>Your answer: <span class="wrong-text">' + q.answers[a.selected] + "</span></p>";
        reviewHtml += '<p>Correct answer: <span class="correct-text">' + q.answers[a.correct] + "</span></p>";
      }
      reviewHtml += "</div>";
    });
    document.getElementById("quiz-review").innerHTML = reviewHtml;
    quizResults.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  document.getElementById("start-quiz-btn").addEventListener("click", startQuiz);
  document.getElementById("restart-quiz-btn").addEventListener("click", startQuiz);

  // ─── Glossary ─────────────────────────────────────────────────────
  var glossaryTerms = [
    { term: "Ahoy", definition: "A greeting used by pirates, similar to 'Hello' or 'Hey there!'" },
    { term: "Avast", definition: "A command meaning 'Stop!' or 'Pay attention!'" },
    { term: "Aye Aye", definition: "An enthusiastic 'Yes!' — used to acknowledge an order from the captain." },
    { term: "Batten Down the Hatches", definition: "To prepare for a storm or trouble by securing everything on deck." },
    { term: "Bilge Rat", definition: "A term for the lowest-ranking member of the crew, or an insult for someone unpleasant." },
    { term: "Blimey", definition: "An exclamation of surprise, like 'Oh my!' or 'Goodness!'" },
    { term: "Booty", definition: "Treasure or stolen goods captured during a raid." },
    { term: "Buccaneer", definition: "Another word for pirate, originally referring to Caribbean pirates." },
    { term: "Captain", definition: "The leader of a pirate ship, elected by the crew in many cases." },
    { term: "Corsair", definition: "A pirate, especially one operating in the Mediterranean Sea." },
    { term: "Crow's Nest", definition: "The lookout platform near the top of the main mast." },
    { term: "Cutlass", definition: "A short, curved sword favored by pirates for close combat." },
    { term: "Davy Jones' Locker", definition: "The bottom of the sea — a term for where drowned sailors rest." },
    { term: "Dead Reckoning", definition: "A method of navigation using speed, time, and direction to estimate position." },
    { term: "Doubloon", definition: "A Spanish gold coin, a favorite form of pirate treasure." },
    { term: "Fathom", definition: "A unit of measurement equal to 6 feet, used to measure water depth." },
    { term: "First Mate", definition: "The captain's second-in-command, responsible for the crew and daily operations." },
    { term: "Gangplank", definition: "A movable board used to walk between the ship and the dock." },
    { term: "Grog", definition: "A drink of rum mixed with water, sometimes with sugar and lime juice." },
    { term: "Hornswaggle", definition: "To cheat or trick someone." },
    { term: "Jolly Roger", definition: "The famous pirate flag, usually showing a skull and crossbones on a black background." },
    { term: "Keelhaul", definition: "A severe punishment where a sailor was dragged under the ship's hull." },
    { term: "Landlubber", definition: "A person who is not used to life at sea — an insult among pirates." },
    { term: "Loot", definition: "Treasure or valuables stolen during raids." },
    { term: "Marooned", definition: "Left stranded on a deserted island as punishment." },
    { term: "Matey", definition: "A friendly term for a fellow pirate or friend." },
    { term: "Plunder", definition: "To steal goods by force, or the goods themselves." },
    { term: "Port", definition: "The left side of the ship when facing forward." },
    { term: "Privateer", definition: "A pirate authorized by a government to attack enemy ships during wartime." },
    { term: "Quartermaster", definition: "The officer in charge of supplies and dividing up the loot fairly." },
    { term: "Scallywag", definition: "A mischievous or naughty person — a playful pirate insult." },
    { term: "Scurvy", definition: "A disease caused by lack of vitamin C, common among sailors who didn't eat enough fruit." },
    { term: "Sea Dog", definition: "An experienced and old sailor." },
    { term: "Shiver Me Timbers", definition: "An exclamation of surprise or shock, like 'Well I never!'" },
    { term: "Starboard", definition: "The right side of the ship when facing forward." },
    { term: "Swashbuckler", definition: "A daring, adventurous person — a romantic term for a pirate." },
    { term: "Walk the Plank", definition: "A punishment where a person was forced to walk off a board into the sea." },
    { term: "Yo Ho Ho", definition: "A cheerful pirate exclamation, often associated with drinking songs." }
  ];

  var glossaryList = document.getElementById("glossary-list");
  var glossaryFilter = document.getElementById("glossary-filter");

  function renderGlossary(filter) {
    glossaryList.innerHTML = "";
    var filterLower = (filter || "").toLowerCase();
    var filtered = glossaryTerms.filter(function (item) {
      return item.term.toLowerCase().indexOf(filterLower) !== -1 ||
        item.definition.toLowerCase().indexOf(filterLower) !== -1;
    });

    if (filtered.length === 0) {
      glossaryList.innerHTML = '<p class="no-results">No matching terms found. Try a different search!</p>';
      return;
    }

    filtered.forEach(function (item) {
      var details = document.createElement("details");
      details.className = "glossary-item";
      var summary = document.createElement("summary");
      summary.className = "glossary-term";
      summary.textContent = item.term;
      var desc = document.createElement("p");
      desc.className = "glossary-definition";
      desc.textContent = item.definition;
      details.appendChild(summary);
      details.appendChild(desc);
      glossaryList.appendChild(details);
    });
  }

  renderGlossary("");

  glossaryFilter.addEventListener("input", function () {
    renderGlossary(glossaryFilter.value);
  });

})();
