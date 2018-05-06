let legatoId = 1;

export function legato (items) {
    legatoId++;
    return items.map(item => {
        item.legato = legatoId;
        return item;
    });
}

export function staccato (items) {
    return items.map(item => {
        item.staccato = true;
        return item;
    });
}
