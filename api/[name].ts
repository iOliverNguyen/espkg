import { NowRequest, NowResponse } from '@vercel/node'

export default (req: NowRequest, res: NowResponse) => {
  const {query} = req
  const { name = 'World' } = query

  res.status(200).send(`Hello ${name}!!!`)
}
