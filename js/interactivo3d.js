const card3d = document.getElementById('card3d');
const container3d = document.querySelector('.canvas-area');
const prendaBase = document.getElementById('prendaBase');
const apliqueLayer = document.getElementById('apliqueLayer');
const fileUploader = document.getElementById('fileUploader');

// ==========================================
// 1. EFECTO DINÁMICO 3D (MOVIMIENTO DEL MOUSE)
// ==========================================
container3d.addEventListener('mousemove', (e) => {
    // Obtenemos el tamaño y posición del contenedor visual
    const rect = container3d.getBoundingClientRect();
    
    // Calculamos el centro del contenedor
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculamos la distancia del mouse respecto al centro (-1 a 1)
    const deltaX = (e.clientX - centerX) / (rect.width / 2);
    const deltaY = (e.clientY - centerY) / (rect.height / 2);
    
    // Multiplicamos por los grados máximos de inclinación (ej: 25 grados)
    const rotateX = (-deltaY * 25).toFixed(2);
    const rotateY = (deltaX * 25).toFixed(2);
    
    // Aplicamos la transformación tridimensional en tiempo real
    card3d.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    card3d.style.boxShadow = `${-rotateY * 2}px ${rotateX * 2}px 30px rgba(11,29,58,0.25)`;
});

// Restablecer la posición original cuando el mouse sale del contenedor
container3d.addEventListener('mouseleave', () => {
    card3d.style.transform = "rotateX(0deg) rotateY(0deg)";
    card3d.style.boxShadow = "0 20px 40px rgba(0,0,0,0.15)";
});


// ==========================================
// 2. CARGADOR DE IMÁGENES EN TIEMPO REAL
// ==========================================
fileUploader.addEventListener('change', function(e) {
    const file = e.target.files[0];
    
    if (file) {
        // Validar que sea un archivo de tipo imagen
        if (!file.type.startsWith('image/')) {
            alert('Por favor, selecciona un archivo de imagen válido.');
            return;
        }

        const reader = new FileReader();
        
        // Cuando el archivo termine de leerse, lo inyectamos en la capa del aplique
        reader.onload = function(event) {
            apliqueLayer.style.backgroundImage = `url('${event.target.result}')`;
        };
        
        reader.readAsDataURL(file);
    }
});


// ==========================================
// 3. CONTROLES DEL PANEL (COLOR, TÉCNICA, ESCALA)
// ==========================================
function changeClothColor(color) {
    if(color === '#ffffff') {
        prendaBase.style.filter = "none";
    } else if (color === '#ff3333') {
        prendaBase.style.filter = "hue-rotate(0deg) saturate(5) brightness(0.8)";
    } else if (color === '#3333ff') {
        prendaBase.style.filter = "hue-rotate(220deg) saturate(4) brightness(0.7)";
    } else if (color === '#111111') {
        prendaBase.style.filter = "grayscale(1) brightness(0.2)";
    }
}

function changeTechnique(technique) {
    if(technique === 'ruber') {
        apliqueLayer.style.boxShadow = "0 8px 16px rgba(0,0,0,0.5)";
        apliqueLayer.style.filter = "contrast(1.2) drop-shadow(2px 4px 6px black)";
    } else if(technique === 'caucho') {
        apliqueLayer.style.boxShadow = "0 3px 6px rgba(0,0,0,0.3)";
        apliqueLayer.style.filter = "none";
    } else if(technique === 'laser') {
        apliqueLayer.style.boxShadow = "0 4px 10px rgba(245, 185, 33, 0.6)";
        apliqueLayer.style.filter = "hue-rotate(45deg) brightness(1.4) saturate(1.5)";
    }
}

function changeScale(size) {
    apliqueLayer.style.width = `${size}px`;
    apliqueLayer.style.height = `${size}px`;
}

function addToCart() {
    alert("¡Diseño multimedia personalizado! Tu diseño ha sido procesado con éxito y añadido al Carrito de Compras.");
}

// ==========================================
// 4. SISTEMA DE COTIZACIÓN EN PESOS COLOMBIANOS (COP)
// ==========================================

// Variables globales para almacenar el estado de la cotización
let currentTechnique = 'ruber'; // Técnica por defecto
let currentScale = 80;          // Escala por defecto

// Precios base por unidad según la técnica (Valores promedio del mercado)
const basePrices = {
    ruber: 6500,   // Alta definición microinyección
    caucho: 4500,  // Material flexible mate
    laser: 5500    // Corte de precisión / metalizados
};

function calculateQuote() {
    const quantity = parseInt(document.getElementById('quantityInput').value) || 0;
    
    // 1. Validar cantidad mínima
    if (quantity < 12) {
        document.getElementById('unitPriceText').innerText = "Mínimo 12 und.";
        document.getElementById('totalPriceText').innerText = "COP \$0";
        return;
    }

    // 2. Obtener precio base de la técnica seleccionada
    let unitPrice = basePrices[currentTechnique];

    // 3. Modificador por tamaño (Si el aplique es más grande de 90px, aumenta el costo del material)
    if (currentScale > 90) {
        const sizeFactor = (currentScale - 90) * 40; // Añade \$40 COP por cada punto de escala extra
        unitPrice += sizeFactor;
    }

    // 4. Descuento por Volumen (Escala comercial textil)
    let discount = 0;
    if (quantity >= 100 && quantity < 500) {
        discount = 0.15; // 15% de descuento por más de 100 unidades
    } else if (quantity >= 500) {
        discount = 0.30; // 30% de descuento para lotes mayoristas (más de 500 unidades)
    }

    unitPrice = unitPrice * (1 - discount);
    const totalPrice = unitPrice * quantity;

    // 5. Formatear los números a moneda Colombiana (COP) sin decimales
    const formatter = new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    });

    // 6. Pintar resultados en la interfaz
    document.getElementById('unitPriceText').innerText = formatter.format(unitPrice);
    document.getElementById('totalPriceText').innerText = formatter.format(totalPrice);
}

// ==========================================
// 5. CONEXIÓN DE LAS FUNCIONES EXISTENTES AL COTIZADOR
// ==========================================

// Modificamos la función de técnica que tenías para que actualice el precio
function changeTechnique(technique) {
    currentTechnique = technique; // Actualiza la técnica global
    
    if(technique === 'ruber') {
        apliqueLayer.style.boxShadow = "0 8px 16px rgba(0,0,0,0.5)";
        apliqueLayer.style.filter = "contrast(1.2) drop-shadow(2px 4px 6px black)";
    } else if(technique === 'caucho') {
        apliqueLayer.style.boxShadow = "0 3px 6px rgba(0,0,0,0.3)";
        apliqueLayer.style.filter = "none";
    } else if(technique === 'laser') {
        apliqueLayer.style.boxShadow = "0 4px 10px rgba(245, 185, 33, 0.6)";
        apliqueLayer.style.filter = "hue-rotate(45deg) brightness(1.4) saturate(1.5)";
    }
    
    calculateQuote(); // Recalcula la cotización inmediatamente
}

// Modificamos la función de escala para que afecte el precio
function changeScale(size) {
    apliqueLayer.style.width = `${size}px`;
    apliqueLayer.style.height = `${size}px`;
    
    currentScale = parseInt(size); // Actualiza la escala global
    calculateQuote(); // Recalcula la cotización inmediatamente
}

// Añadimos una ejecución inicial al cargar la página para que no aparezca en \$0
window.addEventListener('DOMContentLoaded', () => {
    calculateQuote();
});

// Modificamos la alerta de añadir al carrito para que sea más profesional
function addToCart() {
    const totalEst = document.getElementById('totalPriceText').innerText;
    const cant = document.getElementById('quantityInput').value;
    
    if (cant < 12) {
        alert("Por favor, ingresa una cantidad válida igual o mayor a 12 unidades.");
        return;
    }
    
    alert(`¡Orden Multimedia Procesada!\n\nSe ha añadido al carrito:\nLote de ${cant} prendas con técnica ${currentTechnique.toUpperCase()}.\nValor Estimado: ${totalEst}.\n\nTu asesor de Formas e Ideas se contactará contigo.`);
}
