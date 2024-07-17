let preguntas_aleatorias = true;
let mostrar_pantalla_juego_términado = true;
let reiniciar_puntos_al_reiniciar_el_juego = true;

let base_preguntas = [
  {
    "pregunta": "¿Cómo se llama la plaza principal de la ciudad de Catamarca?",
    "respuesta": "Plaza 25 de Mayo",
    "incorrecta1": "Independencia",
    "incorrecta2": "Plaza San Martin",
    "incorrecta3": "Plaza de la Constitución",
    "imagen": "../images/preguntados/plaza-25-de-mayo-catamarca-capital.webp",
    "objectFit": "cover"
  },
  {
    "pregunta": "En SFVC contamos con un espejo de agua rodeado de montaña, su nombre es?",
    "respuesta": "Dique El Jumeal",
    "incorrecta1": "Laguna Azul",
    "incorrecta2": "Embalse Las Pirquitas",
    "incorrecta3": "Río del Valle",
    "imagen": "../images/preguntados/Jumeal-800x445.jpg",
    "objectFit": "cover"
  },
  {
    "pregunta": "¿Cuál es la fiesta más grande del País que se celebra en el invierno?",
    "respuesta": "Fiesta Nacional e Internacional del Poncho",
    "incorrecta1": "Fiesta Nacional de las Artesanías",
    "incorrecta2": "Fiesta Nacional de la Nieve",
    "incorrecta3": "Fiesta Nacional del Folklore",
    "imagen": "../images/preguntados/poncho.jpg",
    "objectFit": "cover"
  },
  {
    "pregunta": "¿En qué fecha se celebra la Fundación de la Ciudad de SFVC?",
    "respuesta": "5 de Julio",
    "incorrecta1": "9 de Julio",
    "incorrecta2": "25 de Agosto",
    "incorrecta3": "12 de Septiembre",
    "imagen": "../images/preguntados/fundacion.webp",
    "objectFit": "cover"
  },
  {
    "pregunta": "¿Qué número de edición es la de este año 2024 de la Fiesta Nacional e Internacional del Poncho?",
    "respuesta": "53 años",
    "incorrecta1": "50 años",
    "incorrecta2": "56 años",
    "incorrecta3": "55 años",
    "imagen": "../images/preguntados/poncho2024.webp",
    "objectFit": "cover"
  },
  {
    "pregunta": "¿Cómo se llama el espacio natural y recreativo que se encuentra en las lomadas de El Jumeal, que se ha convertido en el mayor atractivo turístico de la ciudad?",
    "respuesta": "Parque de Los Vientos",
    "incorrecta1": "Parque de los Niños",
    "incorrecta2": "Parque Adán Quiroga",
    "incorrecta3": "Parque El Jumeal",
    "imagen": "../images/preguntados/plaza-vientos.jpg",
    "objectFit": "cover"
  },
  {
    "pregunta": "¿Qué Sitio Arqueológico se encuentra a la vera de la Ruta Provincial Nº 4 camino a El Rodeo?",
    "respuesta": "Pueblo Perdido de la Quebrada",
    "incorrecta1": "Centro Cultural Arqueológico",
    "incorrecta2": "Museo Arqueológico de La Aguada",
    "incorrecta3": "Sitio El Shincal",
    "imagen": "../images/preguntados/quebrada.jpg",
    "objectFit": "cover"
  },
  {
    "pregunta": "Si inicio un recorrido en auto desde la Plaza 25 de Mayo, ¿aproximadamente a cuántos minutos estoy en el Dique El Jumeal?",
    "respuesta": "10 minutos",
    "incorrecta1": "60 minutos",
    "incorrecta2": "25 minutos",
    "incorrecta3": "45 minutos",
    "imagen": "../images/preguntados/Jumeal-800x445.jpg",
    "objectFit": "cover"
  },
  {
    "pregunta": "¿Quién fue declarada en el año 1974 Patrona Nacional del Turismo?",
    "respuesta": "Virgen del Valle",
    "incorrecta1": "Virgen de Luján",
    "incorrecta2": "Virgen de Itatí",
    "incorrecta3": "Virgen de San Nicolás",
    "imagen": "../images/preguntados/Virgen-del-Valle.jpg",
    "objectFit": "cover"
  },
  {
    "pregunta": "En la Capital, ¿qué bodega puedo visitar?",
    "respuesta": "Mi Chango",
    "incorrecta1": "Perro Guardián",
    "incorrecta2": "Don Diego",
    "incorrecta3": "Bodega Catamarca",
    "imagen": "../images/preguntados/vinedo.jpg",
    "objectFit": "cover"
  },
  {
    "pregunta": "Esta imagen del campanario, ¿a qué edificio pertenece?",
    "respuesta": "Catedral Basílica Nuestra Señora del Valle",
    "incorrecta1": "Seminario Diocesano Menor",
    "incorrecta2": "Convento de San Francisco",
    "incorrecta3": "Iglesia de San Francisco",
    "imagen": "../images/preguntados/1200px-Catedral_Basílica_Nuestra_Señora_del_Valle,_Catamarca.jpg",
    "objectFit": "cover"
  },
  {
    "pregunta": "En Catamarca se realizan dos procesiones en honor a la Virgen del Valle. ¿Durante qué época del año?",
    "respuesta": "Abril - Diciembre",
    "incorrecta1": "Diciembre - Mayo",
    "incorrecta2": "Abril - Noviembre",
    "incorrecta3": "Mayo - Octubre",
    "imagen": "../images/preguntados/Procesión-de-la-Virgen-del-Valle-Catamarca_-1.jpg",
    "objectFit": "cover"
  }
];

window.onload = function () {
  interprete_bp = base_preguntas;
  escogerPreguntaAleatoria();
};

let pregunta;
let posibles_respuestas;
let btn_correspondiente = [
  select_id("btn1"),
  select_id("btn2"),
  select_id("btn3"),
  select_id("btn4")
];
let npreguntas = [];

let preguntas_hechas = 0;
let preguntas_correctas = 0;

function escogerPreguntaAleatoria() {
  let n;
  if (preguntas_aleatorias) {
    n = Math.floor(Math.random() * interprete_bp.length);
  } else {
    n = 0;
  }

  while (npreguntas.includes(n)) {
    n++;
    if (n >= interprete_bp.length) {
      n = 0;
    }
    if (npreguntas.length === 12) {
      if (mostrar_pantalla_juego_términado) {
        swal.fire({
          title: "Juego finalizado",
          text: "Puntuación: " + preguntas_correctas + "/" + npreguntas.length,
          icon: "success"
        }).then(() => {
          location.reload();
        });
      }
      if (reiniciar_puntos_al_reiniciar_el_juego) {
        preguntas_correctas = 0;
        preguntas_hechas = 0;
      }
      npreguntas = [];
      return;
    }
  }
  npreguntas.push(n);
  preguntas_hechas++;

  escogerPregunta(n);
}

function escogerPregunta(n) {
  pregunta = interprete_bp[n];
  select_id("pregunta").innerHTML = pregunta.pregunta;
  select_id("numero").innerHTML = n;
  let pc = preguntas_correctas;
  select_id("puntaje").innerHTML = pc + "/" + npreguntas.length;

  style("imagen").objectFit = pregunta.objectFit;
  desordenarRespuestas(pregunta);
  if (pregunta.imagen) {
    select_id("imagen").setAttribute("src", pregunta.imagen);
    style("imagen").height = "350px";
    style("imagen").width = "100%";
  } else {
    style("imagen").height = "0px";
    style("imagen").width = "0px";
    setTimeout(() => {
      select_id("imagen").setAttribute("src", "");
    }, 500);
  }
}

function desordenarRespuestas(pregunta) {
  posibles_respuestas = [
    pregunta.respuesta,
    pregunta.incorrecta1,
    pregunta.incorrecta2,
    pregunta.incorrecta3
  ];
  posibles_respuestas.sort(() => Math.random() - 0.5);

  select_id("btn1").innerHTML = posibles_respuestas[0];
  select_id("btn2").innerHTML = posibles_respuestas[1];
  select_id("btn3").innerHTML = posibles_respuestas[2];
  select_id("btn4").innerHTML = posibles_respuestas[3];
}

let suspender_botones = false;

function oprimir_btn(i) {
  if (suspender_botones) {
    return;
  }
  suspender_botones = true;
  if (posibles_respuestas[i] == pregunta.respuesta) {
    preguntas_correctas++;
    btn_correspondiente[i].style.background = "lightgreen";
  } else {
    btn_correspondiente[i].style.background = "pink";
  }
  for (let j = 0; j < 4; j++) {
    if (posibles_respuestas[j] == pregunta.respuesta) {
      btn_correspondiente[j].style.background = "lightgreen";
      break;
    }
  }
  setTimeout(() => {
    reiniciar();
    suspender_botones = false;
  }, 3000);
}

function reiniciar() {
  for (const btn of btn_correspondiente) {
    btn.style.background = "white";
  }
  escogerPreguntaAleatoria();
}

function select_id(id) {
  return document.getElementById(id);
}

function style(id) {
  return select_id(id).style;
}
