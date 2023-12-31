import { NextRequest, NextResponse } from 'next/server'
export type ErrorResponse = {
  error: string
}

//Tにはデータ型を入れる。
// {error:string}かTをbodyのjsonに持つnextresponseを持つ方を返す
export type ErrorHandledResopnse<T> = NextResponse<T | ErrorResponse>

type FunctionType<T> = () => Promise<T>

//dataGetFunctionで取得したデータをNextResponse形式で返す。エラーの場合は{error:string}がレスポンスに入る
export async function errorHandledApi<T>(
  dataGetFunction: FunctionType<T>,
): Promise<ErrorHandledResopnse<T>> {
  try {
    const data = await dataGetFunction()
    return NextResponse.json(data)
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ error: error.message })
  }
}
