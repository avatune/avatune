import type { BaseAvatarItem, Theme } from '@avatune/types'
import { offsetFrom, percentage } from '@avatune/utils'

const getHeadPosition = (size: number) => ({
  x: size * percentage('32%'),
  y: size * percentage('30%'),
})

const fromHead = offsetFrom(getHeadPosition)

export default {
  style: {
    size: 200,
    backgroundColor: '#a7c957',
    borderRadius: 0,
  },
  body: {
    sweater: {
      position: fromHead(-percentage('3.5%'), percentage('42%')),
      layer: 10,
      color: '#720026',
    },
  },
  ears: {
    standard: {
      position: fromHead(-percentage('1.8%'), percentage('20%')),
      layer: 100,
      color: '#FFA882',
    },
  },
  eyebrows: {
    standard: {
      position: fromHead(percentage('7%'), percentage('17%')),
      layer: 30,
      color: '#7F3D2B',
    },
  },
  eyes: {
    boring: {
      position: fromHead(percentage('7.5%'), percentage('21%')),
      layer: 20,
      color: '#FCBE93',
    },
    dots: {
      position: fromHead(percentage('11%'), percentage('21%')),
      layer: 20,
      color: '#000000',
    },
  },
  hair: {
    short: {
      position: fromHead(-percentage('1%'), -percentage('1%')),
      layer: 5,
      color: '#7F3D2B',
    },
    long: {
      position: fromHead(-percentage('17%'), -percentage('3%')),
      layer: 5,
      color: '#FFD859',
    },
    medium: {
      position: fromHead(-percentage('0.4%'), -percentage('2%')),
      layer: 5,
      color: '#1F1C41',
    },
  },
  head: {
    oval: {
      position: fromHead(percentage('0%'), percentage('0%')),
      layer: 1,
      color: '#FCBE93',
    },
  },
  mouth: {
    laugh: {
      position: fromHead(percentage('9.8%'), percentage('33%')),
      layer: 25,
      color: '#000000',
    },
    smile: {
      position: fromHead(percentage('7%'), percentage('30%')),
      layer: 25,
      color: '#000000',
    },
    nervous: {
      position: fromHead(percentage('8.5%'), percentage('32%')),
      layer: 25,
      color: '#000000',
    },
  },
  noses: {
    curve: {
      position: fromHead(percentage('15%'), percentage('28%')),
      layer: 15,
      color: '#FF9C8D',
    },
    dots: {
      position: fromHead(percentage('15%'), percentage('28%')),
      layer: 15,
      color: '#FF9C8D',
    },
  },
} satisfies Theme<BaseAvatarItem>
