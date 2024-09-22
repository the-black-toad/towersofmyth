import { Entity } from './entity'
import { IAwake, IUpdate } from '@/app/utils'

export interface IComponent extends IUpdate, IAwake{
    Entity: Entity | null
}