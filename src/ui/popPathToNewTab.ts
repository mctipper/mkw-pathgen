export function popToNewTab() {
    const target = document.getElementById('generated-path');
    if (!target) return;

    const newWindow = window.open('', '_blank');

    // empty shell
    const doc = newWindow!.document;

    // inject existing <head>
    const headClone = document.head.cloneNode(true) as HTMLHeadElement;
    doc.head.innerHTML = headClone.innerHTML;

    // inject generated path
    const contentClone = target.cloneNode(true) as HTMLElement;
    doc.body.appendChild(contentClone);
}
