const firebase = require("firebase/compat/app");
require("firebase/compat/auth");
require("firebase/compat/firestore");

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC-awoLK4cc0XtLtNppibqgYnNLclUeeI4",
    authDomain: "kuar-tor-portal.firebaseapp.com",
    projectId: "kuar-tor-portal",
    storageBucket: "kuar-tor-portal.firebasestorage.app",
    messagingSenderId: "438781244189",
    appId: "1:438781244189:web:99ea6a25fc459b14f567f4",
    measurementId: "G-X5GTEY10VZ"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();

const estadoGlobal = {
    fundosComunitarios: 50000,
    rooms: {
        forja: { name: "Forja", cost: 0, unlocked: true, npcId: 'bruza', icon: 'Hammer' },
        cozinha: { name: "Cozinha", cost: 0, unlocked: true, npcId: 'lucerina', icon: 'Soup' },
        biblioteca: { name: "Biblioteca", cost: 0, unlocked: true, npcId: 'rayllum', icon: 'BookOpen' },
        alquimia: { name: "Lab. de Alquimia", cost: 2000, unlocked: true, npcId: 'miranda', icon: 'FlaskConical' },
        prazeres: { name: "Casa dos Prazeres", cost: 3000, unlocked: true, npcId: 'eveline', isLust: true, icon: 'Heart' },
        mercado: { name: "Mercado Negro", cost: 0, unlocked: true, npcId: 'corvus', icon: 'Scale' },
        engenheiros: { name: "Lab. dos Engenheiros", cost: 1500, unlocked: false, npcId: null, icon: 'Cog' },
        magias: { name: "Lab. das Magias", cost: 1000, unlocked: false, npcId: null, icon: 'Sparkles' },
        enfermaria: { name: "Enfermaria", cost: 3000, unlocked: false, npcId: null, icon: 'PlusSquare' },
        mineracao: { name: "Posto de Mineração", cost: 2000, unlocked: false, npcId: null, icon: 'Pickaxe' },
        estufa: { name: "Estufa Alquímica", cost: 2000, unlocked: false, npcId: null, icon: 'Leaf' },
        mercador: { name: "Portal do Mercador", cost: -1, unlocked: false, npcId: null, icon: 'Gateway' },
        missoes: { name: "Quadro de Missões", cost: 0, unlocked: true, npcId: null, icon: 'ClipboardList' }
    },
    npcs: {
        bruza: { name: "Bruza, o Ferreiro", title: `"Aço e fogo. É tudo que resta."`, description: "Um mestre de seu ofício, Bruza pode transformar sucata em lâminas mortais.", image: "https://placehold.co/100x100/2a2a2a/c5a173?text=B", items: [{ name: "Reparar Equipamento", price: 50 }, { name: "Lâmina Serrilhada", price: 250 }, { name: "Placas de Quitina", price: 400 }] },
        lucerina: { name: "Lucerina, a Cozinheira", title: `"Um estômago cheio luta melhor."`, description: "Lucerina faz milagres com as rações escassas, criando refeições que aquecem a alma.", image: "https://placehold.co/100x100/2a2a2a/c5a173?text=L", items: [{ name: "Ensopado Revigorante (+1 CON temp.)", price: 30 }, { name: "Pão de Raiz (Ração de Viagem)", price: 10 }, { name: "Chá de Ervas Raras (+1 SAB temp.)", price: 45 }] },
        rayllum: { name: "Rayllum, a Bibliotecária", title: `"O conhecimento é a única luz neste breu."`, description: "Guardiã do saber resgatado, Rayllum oferece pergaminhos e conhecimento arcano.", image: "https://placehold.co/100x100/2a2a2a/c5a173?text=R", items: [{ name: "Identificar Item", price: 100 }, { name: "Pergaminho de Proteção Menor", price: 150 }, { name: "Mapa de Bestiário (Incompleto)", price: 300 }] },
        miranda: { name: "Miranda, a Alquimista", title: `"A essência da vida e da morte em um frasco."`, description: "Miranda lida com substâncias perigosas para criar elixires potentes e venenos mortais.", image: "https://placehold.co/100x100/2a2a2a/c5a173?text=M", items: [{ name: "Poção de Cura Maior (4d6 PV)", price: 150 }, { name: "Frasco de Fogo Alquímico", price: 120 }, { name: "Veneno de Serpente das Cinzas", price: 200 }] },
        eveline: { name: "Eveline, a Condessa", title: `"Até no fim do mundo, há prazeres a serem encontrados."`, description: "Na Casa dos Prazeres, Eveline oferece um alívio fugaz das agruras de Kuar-Tor... por um preço.", image: "https://placehold.co/100x100/8c3a5a/ffffff?text=E", isLust: true, items: [{ name: "Uma Noite de Esquecimento (cura de stress)", price: 500 }, { name: "Um Segredo Sussurrado (dica de lore)", price: 350 }, { name: "Favor da Condessa (+1 CAR temp.)", price: 700 }] },
        corvus: { name: "Corvus, o Colecionador", title: `"Tudo tem um preço... especialmente o que não deveria estar à venda."`, description: "Uma figura sombria que sempre parece ter exatamente o que você precisa, ou o que você nem sabia que queria.", image: "https://placehold.co/100x100/1a1a1a/c5a173?text=C", items: [
            { id: 'wep_01', name: "Adaga de Osso Serrilhado", value: 350, type: 'arma' },
            { id: 'wep_02', name: "Machado Pesado de Sucata", value: 450, type: 'arma' },
            { id: 'arm_01', name: "Manto do Desbravador", value: 500, type: 'armadura' },
            { id: 'arm_02', name: "Escudo de Placa de Metal", value: 300, type: 'armadura' },
            { id: 'relic_02', name: "Lanterna de Alma-Penada", value: 1200, type: 'reliquia' },
            { id: 'relic_03', name: "Amuleto de Dente de Fera", value: 600, type: 'reliquia' },
            { id: 'cons_01', name: "Pó do Esquecimento (1 uso)", value: 200, type: 'consumivel' },
            { id: 'cons_03', name: "Estimulante Alquímico Instável", value: 180, type: 'consumivel' },
            { id: 'mat_03', name: "Peça de Autômato Danificada", value: 120, type: 'material' },
            { id: 'mat_04', name: "Cristal de Energia Tênue", value: 250, type: 'material' }
        ]}
    }
};

const main = async () => {
    try {
        console.log("Attempting to populate database...");
        await db.collection('santuario').doc('estadoGlobal').set(estadoGlobal);
        console.log("Database populated successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Error populating database: ", error);
        process.exit(1);
    }
};

main();
