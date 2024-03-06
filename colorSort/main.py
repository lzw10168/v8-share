from networkx import clustering
import numpy as np
from skimage.color import rgb2hsv, hsv2rgb

# 你提供的颜色数组
color_list = [
    'rgba(0,0,0,0.3)',
    'rgba(9, 132, 159, 0.15)',
    '#000',
    'rgba(0, 0, 0, 0.2)',
    'rgba(0,6,13,1)',
    'rgba(153,153,153,1)',
    'rgba(245,247,249, 1)',
    'rgba(9,132,159, 1)',
    'rgba(0,0,0,1)',
    'rgba(9,132,159, 0.15)',
    'rgba(102,102,102,1)',
    '#3C3B6E',
    '#515151',
    '#065c6f',
    '#555',
    '#525659',
    '#495463',
    'rgba(9, 132, 159, 0.05)',
    'rgb(9, 132, 159)',
    'rgba(9,132,159,0.7)'
]

# 将颜色字符串转换为HSV格式的numpy数组
def rgba_to_hsv(color_str):
    # color_str = color_str.replace('(', '').replace(')', '').replace(' ', '')
    if color_str.startswith('rgba'):
        values = color_str[5:-1].split(',')
        # 转换RGB分量为整数，透明度为浮点数
        r, g, b = map(int, values[:3])
        a = float(values[3]) if len(values) > 3 else 1.0  
        print(r, g, b, a)
        color = (r / 255.0, g / 255.0, b / 255.0, a / 255.0)
    elif color_str.startswith('rgb'):
        r, g, b = map(int, color_str[4:-1].split(' '))
        color = (r / 255.0, g / 255.0, b / 255.0, 1.0)
    elif color_str.startswith('#'):
        r, g, b = int(color_str[1:3], 16), int(color_str[3:5], 16), int(color_str[5:7], 16)
        color = (r / 255.0, g / 255.0, b / 255.0, 1.0)
    else:
        raise ValueError(f"Unknown color format: {color_str}")
    print(color)
    hsv_color = rgb2hsv(color)
    return hsv_color

# 计算颜色之间的距离并排序
colors_hsv = [rgba_to_hsv(color) for color in color_list]
print(colors_hsv)
colors_hsv = np.array(colors_hsv)

# 计算所有颜色对之间的距离
distances = np.sqrt(np.sum((colors_hsv[:, np.newaxis] - colors_hsv) ** 2, axis=2))

# 使用scipy的cluster.hierarchy来计算层次聚类
linked = linkage(distances, 'single')

# 获取聚类结果
clusters = clustering(linked, t=0, criterion='distance')

# 根据聚类结果排序
sorted_colors = [(color_list[i], clusters[i]) for i in range(len(color_list))]
sorted_colors.sort(key=lambda x: x[1])

# 提取排序后的颜色数组
sorted_colors_array = [color for color, cluster in sorted_colors]

# 打印排序后的颜色数组
print(sorted_colors_array)
