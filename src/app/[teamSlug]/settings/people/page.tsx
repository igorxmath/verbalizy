import { Avatar, AvatarFallback, AvatarImage } from '#/ui/avatar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '#/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '#/ui/tabs'
import { EllipsisVertical } from '#/icons'
import { Button } from '#/ui/button'

export default function Page() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className='flex items-center justify-between'>
            <p>People</p>
            <Button size={'sm'}>Invite</Button>
          </div>
        </CardTitle>
        <CardDescription>Teammates or friends that have access to this project.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue='members'
          className='w-full'
        >
          <TabsList className='mb-4 grid w-full grid-cols-2'>
            <TabsTrigger value='members'>Members</TabsTrigger>
            <TabsTrigger value='invitations'>Invitations</TabsTrigger>
          </TabsList>
          <TabsContent value='members'>
            <div className='space-y-4'>
              {[...Array(2)].map((_, i) => (
                <div
                  className='flex items-center justify-between px-2'
                  key={i}
                >
                  <div className='flex items-center space-x-2'>
                    <Avatar className='h-8 w-8'>
                      <AvatarImage
                        src={`https://avatar.vercel.sh/igormatheus.png`}
                        alt='igor'
                      />
                      <AvatarFallback>SC</AvatarFallback>
                    </Avatar>
                    <div>
                      <p>Igor Matheus</p>
                      <p className='text-sm text-muted-foreground'>pessoal@igormatheus.com.br</p>
                    </div>
                  </div>
                  <EllipsisVertical className='h-6 w-6' />
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value='invitations'>OI</TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
