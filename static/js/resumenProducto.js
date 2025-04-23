const actualizarDatosDireccion = () => {
  const direccionSelect = document.getElementById('direccion-guardada');
  if (direccionSelect && direccionSelect.options.length > 0) {
      const option = direccionSelect.options[direccionSelect.selectedIndex];
      actualizarCostoEnvio();
      actualizarCamposOcultos();
  }
};

const actualizarCostoEnvio = () => {
  const direccionSelect = document.getElementById('direccion-guardada');
  const productPrice = parseFloat(document.getElementById('product-price').textContent);
  const deliveryCostElem = document.getElementById('delivery-cost');
  const totalPriceElem = document.getElementById('total-price');
  const option = direccionSelect.options[direccionSelect.selectedIndex];
  const tipoDireccion = option.getAttribute('data-tipo');
  let deliveryCost = 0;

  if (tipoDireccion === "1") {
      deliveryCost = 9.49;
  } else if (tipoDireccion === "0") {
      deliveryCost = 11.49;
  }

  deliveryCostElem.textContent = deliveryCost.toFixed(2);
  totalPriceElem.textContent = (productPrice + deliveryCost).toFixed(2);
};

const actualizarCamposOcultos = () => {
  const direccionInput = document.getElementById('direccion-seleccionada-input');
  const tarjetaInput = document.getElementById('tarjeta-seleccionada-input');
  const costoEntregaInput = document.getElementById('costo-entrega-input');
  const totalInput = document.getElementById('total-input');
  const direccionSelect = document.getElementById('direccion-guardada');
  const tarjetaSelect = document.getElementById('tarjeta-guardada');

  if (direccionSelect && direccionSelect.options.length > 0) {
      direccionInput.value = direccionSelect.options[direccionSelect.selectedIndex].textContent.trim();
  }
  if (tarjetaSelect && tarjetaSelect.options.length > 0) {
      const tarjetaOption = tarjetaSelect.options[tarjetaSelect.selectedIndex];
      const partes = tarjetaOption.textContent.split(' ');
      const tarjetaDatos = {
          id: tarjetaOption.value,
          numero_tarjeta: partes[3],
          nombre_titular: tarjetaOption.textContent.split('-')[1].trim()
      };
      tarjetaInput.value = JSON.stringify(tarjetaDatos);
  }
  costoEntregaInput.value = document.getElementById('delivery-cost').textContent.trim();
  totalInput.value = document.getElementById('total-price').textContent.trim();
};

document.addEventListener('DOMContentLoaded', () => {
  actualizarDatosDireccion();
  actualizarCamposOcultos();
  document.getElementById('direccion-guardada').addEventListener('change', actualizarDatosDireccion);
  document.getElementById('tarjeta-guardada').addEventListener('change', actualizarCamposOcultos);
});

function comprobar() {
  var ok = window.confirm("Vas a confirmar la compra del producto. ¿Estás seguro?");
  if (ok) {
      document.getElementById('resumen-form').submit();
  }
}