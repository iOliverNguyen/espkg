// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import type {NextApiRequest, NextApiResponse} from 'next'

export default (req: NextApiRequest, res: NextApiResponse) => {
  const {query} = req
  const {name} = query

  res.statusCode = 200
  res.json({route: `/${name}`})
}
