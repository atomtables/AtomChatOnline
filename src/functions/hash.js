async function hash(string) {
    const utf8 = new TextEncoder().encode(string);
    const hashBuffer = await crypto.subtle.digest('SHA-256', utf8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray
        .map((bytes) => bytes.toString(16).padStart(2, '0'))
        .join('');
}

export default async function combineAndHash(id1, id2) {
    const combinedIds = [id1, id2].sort().join('');
    return await hash(combinedIds);
}