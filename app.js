//set up an array for questions and answers 
let quiz = [
    {
        "question": "What is the correct HTML element for inserting a line break?",
        "correct_answer": "<br>",
        "answers": [
          "<br>",
          "<lb>",
          "<break>",
          "<a>"
        ]
    },

    {
        "question": "Which CSS property controls the text size?",
        "correct_answer": "font-size",
        "answers": [
          "text-style",
          "font-style",
          "font-size",
          "text-size"
        ]
    },

    {
        "question": "How do you make the text bold?",
        "correct_answer": "font-weight:bold",
        "answers": [
          "font-weight:bold",
          "style:bold",
          "font:bold",
          "bold"
        ]
    },

    {
        "question": "How do you create a function in JavaScript?",
        "correct_answer": "function myFunction()",
        "answers": [
          "function = myFunction()",
          "function:myFunction()",
          "function myFunction()",
          "function ()"
        ]
    },

    {
        "question": "How does a FOR loop start?",
        "correct_answer": "font-weight:bold",
        "answers": [
          "for(i=0;i<=5)",
          "for(i=0;i<=5;i++)",
          "for(i<=5;i++)",
          "for i=1 to 5"
        ]
    }
]

let quiznum = 0
let score = 0
let time = 60
let countdown

//set up function to pop up quiz after we click the 'start' button
const popupquiz = () => {
  document.getElementById('question').textContent = quiz[quiznum].question
  let answers = quiz[quiznum].answers
  
  document.getElementById('answers').innerHTML = ''

  for (let i=0; i<answers.length; i++){
      let answerElement = document.createElement('button')
      answerElement.className = 'anSwer btn btn-secondary btn=lg'
      answerElement.dataset.answer = answers[i]
      answerElement.textContent = answers[i]
      document.getElementById('answers').append(answerElement)
  }
}

//set up function to show messages when users pick an answer
const pickanswer = answer => {
  //if a correct answer was picked, score goes up
  if (answer === quiz[quiznum].correct_answer) {
    score++
    document.getElementById('score'),textContent = score
    let resultElement = document.createElement('div')
    resultElement.className = 'alert alert-success'
    resultElement.textContent = `You're right.`
    document.getElementById('answers').append(resultElement)
  } else {
    let resultElement = document.createElement('div')
    resultElement.className = 'alert alert-danger'
    resultElement.textContent = `You're wrong.`
    document.getElementById('answers').append(resultElement)
  }
  //pop up the next question
  quiznum++
  //wait for one second to show the next question
  setTimeout(()=>{
    if(quiznum<quiz.length){
      popupquiz()
    } else {
      finish()
    }
  }, 1000)
}

//submit the score to leaderboard
const submitScore = submission =>{
  let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || []

  leaderboard.push(submission)
  localStorage.setItem('leaderboard', JSON.stringify(leaderboard))
  leaderboard.sort((a,b)=>{
    return b.score-a.score
  })
  //create a table to storage the leaderboard information
  let tableElement = document.createElement('table')
  tableElement.className = 'table'
  tableElement.innerHTML = `
    <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">name</th>
        <th scope="col">score</th>
      </tr>
    </thead>  
  `

  let bodyElement = document.createElement('tbody')

  for (let i=0; i<leaderboard.length; i++){
    let rowElement = document.createElement('tr')
    rowElement.innerHTML = `
      <th scope="row">${i+1}</th>
      <td>${leaderboard[i].name}</td>
      <td>${leaderboard[i].score}</td>    
    `
    bodyElement.append(rowElement)
  }

  tableElement.append(bodyElement)

  document.getElementById('quiz').append(tableElement)
}

//if time ran out or all questions were answered
const finish = () =>{
  document.getElementById('quiz').innerHTML=`
    <h1 class="display-2>Finish</h1>
    <p class="display-4">Your score is : ${score}</p>
    <hr class="my-4">
    <p>Please log in your name to see your rank.</p>
    <form>
      <div class="form-group">
        <label for="name">Your Name</label>
        <input type="text" class="form-control" id="name">
        <button id="submitScore" class="btn btn-primary">Submit</button>
      </div>
    </form>  
  `
}

//after we click 'start', time starts to countdown
document.getElementById('startquiz').addEventListener('click', () =>{
   
  countdown = setInterval(()=>{
    time--
    document.getElementById('time').textContent = time

    if(time<=0){
      clearInterval(countdown)
      finish()
    }
  },1000)
  
  popupquiz()
})

//if answers were clicked, move to next question or if submit was clicked, move to leaderboard.
document.addEventListener('click', event =>{
  if(event.target.classList.contains('anSwer')){
    pickanswer(event.target.dataset.answer)
  } else if (event.target.id === 'submitScore')
    event.preventDefault()
    submitScore({
      name : document.getElementById('name').value,
      score : score
    })
})