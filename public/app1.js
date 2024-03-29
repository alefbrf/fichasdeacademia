//Gym Class
class Workout {
    constructor(exercicio, series, repeticoes, peso, intervalo) {
        this.exercicio = exercicio;
        this.series = series;
        this.repeticoes = repeticoes;
        this.peso = peso;
        this.intervalo = intervalo;
    }
}

//UI class
class UI {
    static displayWorkouts() {
        const workouts = Store.getWorkouts();
        workouts.forEach((workout) => UI.addWorkoutToList(workout));
    }
    static addWorkoutToList(workout) {
        const list = document.querySelector('#gym-list');

        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${workout.exercicio}</td>
            <td>${workout.series}</td>
            <td>${workout.repeticoes}</td>
            <td>${workout.peso}</td>
            <td>${workout.intervalo}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
      `;

        list.appendChild(row);
    }

    static deleteWorkout(el) {
        if (el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#gym-form');
        container.insertBefore(div, form);
        
        // Vanish after 3 sec
        setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }

    static clearFields() {
        document.querySelector('#exercise').value = '';
        document.querySelector('#serie').value = '';
        document.querySelector('#rep').value = '';
        document.querySelector('#weight').value = '';
        document.querySelector('#intervalo').value = '';
    }
}
//Store class
class Store {
    static getWorkouts() {
        let workouts;
        if (localStorage.getItem('workouts') === null) {
            workouts = [];
        } else {
            workouts = JSON.parse(localStorage.getItem('workouts'));
        }

        return workouts;
    }

    static addWorkout(workout) {
        const workouts = Store.getWorkouts();
        workouts.push(workout);
        localStorage.setItem('workouts', JSON.stringify(workouts));
    }

    static removeWorkout(intervalo) {
        const workouts = Store.getWorkouts();
        workouts.forEach((workout, index) => {
            if (workout.intervalo === intervalo) {
                workouts.splice(index, 1);
            }
        });

        localStorage.setItem('workouts', JSON.stringify(workouts));
    }
}

//Events to show book

document.addEventListener('DOMContentLoaded', UI.displayWorkouts);


//Event to Add
document.querySelector('#gym-form').addEventListener('submit', (e) => {

    e.preventDefault();
    //Get form Values
    const exercicio = document.querySelector('#exercise').value;
    const series = document.querySelector('#serie').value;
    const repeticoes = document.querySelector('#rep').value;
    const peso = document.querySelector('#weight').value;
    const intervalo = document.querySelector('#intervalo').value;


    // validate
    if (exercicio === '' || series === '' || repeticoes === '' || peso === '' || intervalo === '') {
        UI.showAlert('Por favor, preencha todas lacunas!', 'danger');
    } else {
        //Instatiate workout

        const workout = new Workout(exercicio, series, repeticoes, peso, intervalo);

        //Add workout to UI
        UI.addWorkoutToList(workout);

        //Add workout to Store
        Store.addWorkout(workout);

        //Show success message
        UI.showAlert('Exercício Salvo', 'success');

        //Clear fields
        UI.clearFields();
    }
    window.location.reload();
});


//Event remove from UI
document.querySelector('#gym-list').addEventListener('click', (e) => {
    UI.deleteWorkout(e.target);

    //Remove workout from Store
    Store.removeWorkout(e.target.parentElement.previousElementSibling.textContent);

    //Show success message
    UI.showAlert('Exercício Excluido', 'success');
});

const data = JSON.parse(localStorage.getItem('workouts'));
console.log(JSON.stringify(data));
console.log(data);


document.querySelector('#enviar').addEventListener('submit', (e) => {
  //  console.log(data);
        fetch("https://map-fichas-academia.onrender.com/send",{
            method: "POST", 
            body: JSON.stringify(data),
            headers: {
                "Content-Type" : "application/json"
            },
        }).then(res =>{res.json(data)},console.log(data))  
          .then(data => console.log(data))
          .catch(err => console.log(err));
    
        e.preventDefault();
        UI.showAlert('Ficha enviada', 'success');
        setTimeout(() => window.location.reload(), 3000);
    });

document.querySelector("#snome").addEventListener('submit', (e)=>{
    const nome = document.querySelector("#nome").value;
    fetch("https://map-fichas-academia.onrender.com/nome",{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nome: nome
            })
    }).then(res =>{res.json(nome)},console.log(nome))  
      .then(data => console.log(data))
      .catch(err => console.log(err));


        e.preventDefault();
        UI.showAlert('Nome Salvo', 'success');
        document.querySelector("#myButton").disabled = false;
})
