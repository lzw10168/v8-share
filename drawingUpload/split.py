# import PyPDF2
# import os
# import re
# https://pymupdf.readthedocs.io/en/latest/installation.html

def extract_number_from_text_N1(text):
    extract_pattern = r'^(.*?)\s+17117Pfizer Exhibit Experience'

    for line in text.split('\n'):
        if re.search(extract_pattern, line):
            match = re.search(extract_pattern, line)
            print(match)
            if match:
                return match.group(1)
            
    return None
    
def extract_number_from_text_N2(text):
    # SE-002
    extract_pattern = r'SE-\d{3}'
    for line in text.split('\n'):
        if re.search(extract_pattern, line):
            match = re.search(extract_pattern, line)
            if match:
                return match.group(0)
    return None
def extract_number_from_text_N5(text):
    extract_pattern = r'^AV\.S\d{2}\.\d{3}$'
    for line in text.split('\n'):
        if re.search(extract_pattern, line):
            match = re.search(extract_pattern, line)
            if match:
                return match.group(0)
    return None
def extract_number_from_text_N7(text):
    extract_pattern = r'^FA\-\d{2}\-\d{2}'
    for line in text.split('\n'):
        if re.search(extract_pattern, line):
            match = re.search(extract_pattern, line)
            if match:
                return match.group(0)
    return None
def extract_number_from_text_N8(text):
    extract_pattern = r'21505\s+(.*)'
    for line in text.split('\n'):
        if re.search(extract_pattern, line):
            match = re.search(extract_pattern, line)
            if match:
                return match.group(1)
    return None

def extract_number_from_text_N4(text):
    date_pattern = "12/14/2021"  # 这里替换成你要查找的日期
    # 使用正则表达式查找包含日期的行
    for line in text.split('&nbsp;'):
        if re.search(date_pattern, line):
            # 找到包含日期的行后，提取编号
            match = re.search(r'([A-Za-z0-9]+)\s*' + date_pattern, line)
            if match:
                return match.group(1)
    return None



def split_pdf_pages(pdf_path, output_folder, extract_number_from_text_func):
    # 检查输出文件夹是否存在，不存在则创建
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    # 读取PDF文件
    with open(pdf_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        num_pages = len(reader.pages)

        # 遍历PDF中的每一页
        for page in range(num_pages):
            writer = PyPDF2.PdfWriter()
            current_page = reader.pages[page]
            writer.add_page(current_page)

            # 读取当前页的内容
            content = current_page.extract_text()
            # 从内容中提取编号
            number = extract_number_from_text_func(content)

            # 如果找到编号，则使用编号重命名文件
            if number:
                output_filename = os.path.join(output_folder, f'page_{page + 1}-{number}.pdf')
            else:
                # 如果没有找到编号，使用默认的页码命名
                output_filename = os.path.join(output_folder, f'page_{page + 1}-{page + 1}.pdf')

            # 输出每一页的PDF
            with open(output_filename, 'wb') as output_file:
                writer.write(output_file)
            
            print(f'Created: {output_filename}')

# 使用示例
# pdf_path = './d1/As Builts Package B level 10-17_REV1.pdf'  # 这里替换成你的PDF文件路径
# output_folder = './d1/output'  # 这里替换成你想要保存拆分后PDF的文件夹路径
# split_pdf_pages(pdf_path, output_folder, extract_number_from_text_N4)
# pdf_path = './N1/04_DCL_As_Built_Drawings.pdf'  
# output_folder = './N1/output'
# split_pdf_pages(pdf_path, output_folder, extract_number_from_text_N1)
# pdf_path = './N8/(0053-01) Pfizer 1st Submittal (Record Set) 01.26.23.pdf'  
# output_folder = './N8/output'
# split_pdf_pages(pdf_path, output_folder, extract_number_from_text_N8)


def reader_pdf(pdf_path):
    with open(pdf_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        num_pages = len(reader.pages)
        print(num_pages)
        for page in range(num_pages):
            current_page = reader.pages[page]
            content = current_page.extract_text()
            print(content)

# reader_pdf('./N8/(0053-01) Pfizer 1st Submittal (Record Set) 01.26.23.pdf')


# def rename_files_in_directory(directory, text_to_remove):
#     # 遍历指定目录下的所有文件
#     for filename in os.listdir(directory):
#         if text_to_remove in filename:
#             # 构建原始文件的完整路径
#             old_file = os.path.join(directory, filename)
#             # 移除文件名中指定的文本
#             new_filename = filename.replace(text_to_remove, '')
#             # 构建新文件名的完整路径
#             new_file = os.path.join(directory, new_filename)
#             # 重命名文件
#             os.rename(old_file, new_file)
#             print(f'Renamed: "{old_file}" to "{new_file}"')

# # 使用示例
# directory = './N1/output'  # 替换为你的目录路径
# text_to_remove = '-04_DCL_As_Built_Drawings'  # 要从文件名中移除的文本
# rename_files_in_directory(directory, text_to_remove)


import fitz  # PyMuPDF

# 打开PDF文件

def extract_text_from_bottom_right_corner(pdf_path):
    # 打开PDF文件
    pdf = fitz.open(pdf_path)
    
    # 存储每一页右下角的文本
    text_from_corners = []
    
    # 遍历每一页
    for page_number in range(len(pdf)):
        # 获取页面对象
        page = pdf[page_number]
        
        # # 计算右下角100x100区域的坐标
        # x0 = page.rect.width 
        # y0 = page.rect.height 
        # x1 = page.rect.width
        # y1 = page.rect.height
        # print(x0, y0, x1, y1)
        # print(page.rect.x0, page.rect.y0, page.rect.x1, page.rect.y1, page.rect.top_left, page.rect.bottom_right)
        # # 创建矩形区域
        # rect = fitz.Rect(0, 0, x1, y1)
        # print(rect)
        # # 提取矩形区域内的文本
        # text = page.get_textbox(rect)
        mat = fitz.Matrix(1, 1)  # 1.5表示放大1.5倍
        rect = page.rect
        #print(rect)
        clip = fitz.Rect(0.9*rect.width, 0.9*rect.height,1*rect.width,1*rect.height)
        pix = page.get_pixmap(matrix=mat, alpha=False, clip=clip)
        pix.save("test.png") 
        a_text = page.get_text(clip=clip)
        print(a_text)
        # 将提取的文本添加到列表中
        # text_from_corners.append(text)

    
    # 关闭PDF文件
    pdf.close()
    
    # 返回每一页右下角的文本
    return text_from_corners

# 使用函数
pdf_file_path = './N4/output/page_27-E19-As Builts Package B level 10-17_REV1.pdf'  # 替换为你的PDF文件路径

texts = extract_text_from_bottom_right_corner(pdf_file_path)
for i, text in enumerate(texts, start=1):
    print(f"Page {i} bottom right corner text: ")
