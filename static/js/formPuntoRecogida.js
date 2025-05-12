
function updateDireccionEntrega() {
    console.log('📦 Dirección de entrega actualizada');
    const selectElement = document.getElementById('puntoId');
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    const direccionEntrega = selectedOption.getAttribute('data-direccion');
    document.getElementById('direccion_entrega').value = direccionEntrega;
}

document.addEventListener('DOMContentLoaded', () => {
    updateDireccionEntrega();
    document.getElementById('puntoId').addEventListener('change', updateDireccionEntrega);
});