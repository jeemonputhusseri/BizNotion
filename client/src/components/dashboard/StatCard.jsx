import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const StatCard = ({ label, count }) => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">
        {label}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-3xl font-bold">{count}</p>
    </CardContent>
  </Card>
)

export  default StatCard;