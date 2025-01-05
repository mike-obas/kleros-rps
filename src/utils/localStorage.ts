export function setItem(key: string, value: any){
    localStorage.setItem(key, JSON.stringify(value))
}

export function getItem(key: string){
    const item = localStorage.getItem(key);
    if(item) return JSON.parse(item)
    return null
}

export function removeItem(key: string){
    localStorage.removeItem(key);
}