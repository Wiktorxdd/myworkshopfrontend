
export async function getCategories() {
    const response = await fetch(`http://localhost:80/api/category`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });

    if (!response.ok) {
        throw new Error("Failed to fetch categories")
    }

    const data = await response.json();
    return data;
}

export async function getCategoryById(id: any) {
    const response = await fetch(`http://localhost:80/api/category/${id}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });

    if (!response.ok) {
        throw new Error("Failed to fetch categories")
    }

    const data = await response.json();

    return data;
}