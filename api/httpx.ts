import fetch from 'node-fetch'

export async function get(url: string) : Promise<any> {
  const resp = await fetch(url)
  return await resp.json()
}
