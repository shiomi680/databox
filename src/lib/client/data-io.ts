import { ErrorResponse } from '../api/response-type'

export async function fetchData<T extends object>(url: string): Promise<T> {
  const res: Response = await fetch(url)
  if (!res.ok) {
    throw new Error(`${res.url} ${res.status}`)
  }
  const data: T | ErrorResponse = await res.json()

  if ('error' in data) {
    throw new Error(`error = ${data.error}`)
  }
  return data
}

const contentJson = (method: string, item: any) => {
  return {
    method: method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(item),
  }
}

export async function putData<OUTPUT extends object, INPUT extends object>(
  url: string,
  params: INPUT,
): Promise<OUTPUT> {
  return put_or_post_data<OUTPUT, INPUT>(url, params, true)
}
export async function postData<OUTPUT extends object, INPUT extends object>(
  url: string,
  params: INPUT,
): Promise<OUTPUT> {
  return put_or_post_data<OUTPUT, INPUT>(url, params, false)
}
async function put_or_post_data<T extends object, K extends object>(
  url: string,
  params: K,
  is_put: boolean,
): Promise<T> {
  const method = is_put ? 'PUT' : 'POST'
  const res: Response = await fetch(url, contentJson(method, params))
  if (!res.ok) {
    throw new Error(`${res.url} ${res.status}`)
  }
  const data: T | ErrorResponse = await res.json()

  if ('error' in data) {
    throw new Error(`error = ${data.error}`)
  }
  return data
}
