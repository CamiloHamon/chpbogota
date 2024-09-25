document.getElementById('form').addEventListener('submit', function () {
    document.getElementById('btn-submit').disabled = true;
    document.getElementById('btn-submit').innerText = 'Procesando...'; // Opcional
});