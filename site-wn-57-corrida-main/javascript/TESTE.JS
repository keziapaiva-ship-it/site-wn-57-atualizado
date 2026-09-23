/* ==========================================
   DADOS DOS LOCAIS
========================================== */

const locais = [

    {
        id: 1,
        nome: "Sugarloaf Mountain",
        categoria: "Atrações",
        icone: "📍",
        lat: -22.9486,
        lng: -43.1565,
        descricao: "Ponto turístico no Rio de Janeiro.",
        distancia: 4.2,
        tempo: 12
    },

    {
        id: 2,
        nome: "Praia do Leme",
        categoria: "Atrações",
        icone: "🌊",
        lat: -22.9632,
        lng: -43.1713,
        descricao: "Praia localizada na zona sul do Rio.",
        distancia: 5.8,
        tempo: 15
    },

    {
        id: 3,
        nome: "Parque Madureira",
        categoria: "Atrações",
        icone: "🌳",
        lat: -22.8697,
        lng: -43.3408,
        descricao: "Área de lazer e entretenimento.",
        distancia: 8.1,
        tempo: 20
    },

    {
        id: 4,
        nome: "Praça da Liberdade",
        categoria: "Atrações",
        icone: "📍",
        lat: -22.9068,
        lng: -43.1729,
        descricao: "Região central da cidade.",
        distancia: 3.4,
        tempo: 10
    },

    {
        id: 5,
        nome: "Parque dos Patins",
        categoria: "Atrações",
        icone: "🏞️",
        lat: -22.9735,
        lng: -43.2228,
        descricao: "Área de lazer na Lagoa.",
        distancia: 6.3,
        tempo: 17
    }

];


/* ==========================================
   CONFIGURAÇÃO DO MAPA
========================================== */

const mapa = L.map("map").setView(
    [-22.9068, -43.1729],
    12
);


/* MAPA */

L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        maxZoom: 19,

        attribution:
            '&copy; OpenStreetMap contributors'
    }
).addTo(mapa);


/* ==========================================
   MARCADORES
========================================== */

const marcadores = {};


/* ÍCONE */

const iconeMapa = L.divIcon({

    className: "",

    html:
        '<div class="marker-personalizado"></div>',

    iconSize: [30, 30],

    iconAnchor: [15, 30],

    popupAnchor: [0, -30]

});


/* ==========================================
   CRIAR MARCADORES
========================================== */

locais.forEach(local => {

    const marcador = L.marker(
        [local.lat, local.lng],
        {
            icon: iconeMapa
        }
    ).addTo(mapa);


    marcador.bindPopup(`
        <strong>${local.nome}</strong>
        <br>
        ${local.descricao}
        <br><br>

        <button
            onclick="selecionarLocal(${local.id})"
            style="
                background:#000;
                color:#fff;
                border:none;
                padding:8px 12px;
                border-radius:15px;
                cursor:pointer;
            "
        >
            Escolher destino
        </button>
    `);


    marcador.on(
        "click",
        function() {

            selecionarLocal(local.id);

        }
    );


    marcadores[local.id] = marcador;

});


/* ==========================================
   LISTA
========================================== */

function carregarLista(lista = locais) {

    const container =
        document.getElementById("listaLocais");


    container.innerHTML = "";


    lista.forEach(local => {

        const item =
            document.createElement("div");


        item.className = "local";

        item.dataset.id = local.id;


        item.innerHTML = `

            <div class="local-topo">

                <span class="local-icone">
                    ${local.icone}
                </span>

                <span class="local-nome">
                    ${local.nome}
                </span>

            </div>

            <div class="local-info">
                ${local.distancia} km ·
                ${local.tempo} min
            </div>

            <button
                onclick="selecionarLocal(${local.id})"
            >
                Ver destino
            </button>

        `;


        item.addEventListener(
            "click",
            function(event) {

                if (
                    event.target.tagName !== "BUTTON"
                ) {

                    selecionarLocal(local.id);

                }

            }
        );


        container.appendChild(item);

    });

}


/* ==========================================
   SELECIONAR LOCAL
========================================== */

function selecionarLocal(id) {

    const local =
        locais.find(item => item.id === id);


    if (!local) return;


    /* Atualiza painel */

    document.getElementById(
        "tituloDestino"
    ).textContent = local.nome;


    document.getElementById(
        "descricaoDestino"
    ).textContent = local.descricao;


    document.getElementById(
        "distancia"
    ).textContent =
        local.distancia + " km";


    document.getElementById(
        "tempo"
    ).textContent =
        local.tempo + " min";


    /* Calcula preço */

    const preco =
        calcularPreco(local.distancia);


    document.getElementById(
        "preco"
    ).textContent =
        "R$ " + preco.toFixed(2).replace(".", ",");


    /* Move mapa */

    mapa.flyTo(
        [local.lat, local.lng],
        15,
        {
            duration: 1.2
        }
    );


    /* Abre marcador */

    if (marcadores[id]) {

        marcadores[id].openPopup();

    }


    /* Marca item selecionado */

    document
        .querySelectorAll(".local")
        .forEach(item => {

            item.classList.remove(
                "selecionado"
            );

        });


    const selecionado =
        document.querySelector(
            `.local[data-id="${id}"]`
        );


    if (selecionado) {

        selecionado.classList.add(
            "selecionado"
        );

        selecionado.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });

    }


    /* Guarda destino */

    window.destinoSelecionado = local;

}


/* ==========================================
   CÁLCULO DE PREÇO
========================================== */

function calcularPreco(distancia) {

    const tarifaBase = 6.00;

    const precoPorKm = 2.80;

    const preco =
        tarifaBase +
        (distancia * precoPorKm);


    return preco;

}


/* ==========================================
   PESQUISA
========================================== */

function pesquisarLocal() {

    const texto =
        document
        .getElementById("campoPesquisa")
        .value
        .toLowerCase()
        .trim();


    const resultados =
        locais.filter(local =>

            local.nome
            .toLowerCase()
            .includes(texto)

        );


    carregarLista(resultados);


    /* Se encontrou exatamente um */

    if (
        resultados.length === 1 &&
        texto.length > 0
    ) {

        selecionarLocal(
            resultados[0].id
        );

    }

}


/* ==========================================
   CATEGORIAS
========================================== */

function trocarCategoria(
    categoria,
    botao
) {

    document
        .querySelectorAll(".aba")
        .forEach(aba => {

            aba.classList.remove(
                "ativa"
            );

        });


    botao.classList.add("ativa");


    /*
       Por enquanto todos os locais
       são atrações.

       Depois podemos cadastrar
       restaurantes, hotéis etc.
    */

    const resultados =
        locais.filter(local => {

            return (
                local.categoria ===
                categoria
            );

        });


    carregarLista(resultados);

}


/* ==========================================
   CENTRALIZAR MAPA
========================================== */

function centralizarMapa() {

    mapa.flyTo(
        [-22.9068, -43.1729],
        12,
        {
            duration: 1
        }
    );

}


/* ==========================================
   INICIAR VIAGEM
========================================== */

function iniciarViagem() {

    if (!window.destinoSelecionado) {

        alert(
            "Escolha primeiro um destino."
        );

        return;

    }


    const destino =
        window.destinoSelecionado;


    const preco =
        calcularPreco(
            destino.distancia
        );


    const confirmacao =
        confirm(
            "Solicitar viagem para " +
            destino.nome +
            "?\n\n" +

            "Distância: " +
            destino.distancia +
            " km\n" +

            "Tempo: " +
            destino.tempo +
            " minutos\n" +

            "Estimativa: R$ " +
            preco
                .toFixed(2)
                .replace(".", ",")
        );


    if (confirmacao) {

        alert(
            "🚗 Viagem solicitada!\n\n" +
            "Destino: " +
            destino.nome
        );

    }

}


/* ==========================================
   CADASTRO
========================================== */

function abrirCadastro() {

    alert(
        "Aqui você pode conectar " +
        "o botão à sua página cadastro.html."
    );

}


/* ==========================================
   INICIALIZAÇÃO
========================================== */

carregarLista();