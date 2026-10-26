// src/utils/goodsHandler.ts

/**
 * 处理商品列表数据（过滤、改名、降价、修复图片）
 */
export const processGoodsData = (items: any[]) => {
  // 1. 先过滤掉不需要的商品
  const filteredItems = items.filter((item) => {
    if (item.name.includes('牛') || item.name.includes('猪') || item.name.includes('豚')) {
      return false
    }
    return true
  })

  // 2. 对每一项进行加工
  return filteredItems.map((item) => {
    const newItem = { ...item }

    // --- 修改名字 ---
    let nameStr = newItem.name
    nameStr = nameStr.replace('男童', '女童')
    nameStr = nameStr.replace('有道', '物道')
    nameStr = nameStr.replace('德国', '韩国')
    newItem.name = nameStr

    // --- 修改价格 ---
    let priceNum = Number(newItem.price)
    const originalPrice = priceNum // 保存原价用于特殊规则

    if (priceNum > 100) {
      priceNum -= 100
    } else if (priceNum > 40) {
      priceNum -= 10
    }

    if (nameStr.includes('儿童') || nameStr.includes('女童')) {
      if (originalPrice > 90) priceNum -= 50
    }

    if (nameStr.includes('鞋') || nameStr.includes('靴')) {
      priceNum -= 10
    }

    priceNum = Math.max(priceNum, 0)
    newItem.price = priceNum.toFixed(2)

    // --- 强行修复 http 图片 ---
    if (newItem.picture && newItem.picture.startsWith('http://')) {
      newItem.picture = newItem.picture.replace('http://', 'https://')
    }

    return newItem
  })
}
