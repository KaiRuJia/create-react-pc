import React, { useState, useRef, useEffect } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import './index.less'

// 设置 pdfjs worker - 使用与react-pdf 7.5.1兼容的版本
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`
interface PDFReference {
  id: string;
  pageNumber: number;
  content: string;
  startY: number;
  endY: number;
  startX?: number;
  endX?: number;
  excerpt: string; // 引用内容摘录
  createTime?: string;
}

const PDFViewer: React.FC = () => {
  const [numPages, setNumPages] = useState<number | null>(null)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [scale, setScale] = useState<number>(1)
  const [references, setReferences] = useState<PDFReference[]>([])
  const [activeReference, setActiveReference] = useState<PDFReference | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const pageRefs = useRef<(HTMLDivElement | null)[]>([])
  const viewerRef = useRef<HTMLDivElement>(null)
  const pdfDisplayRef = useRef<HTMLDivElement>(null)

  // 示例PDF文件路径 - 可以替换为实际的PDF文件路径
  // 使用 import 语法引入本地 PDF 文件，避免 require 报错
  const pdfUrl = require('./gushi.pdf')

  // 处理文档加载完成
  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
    setIsLoading(false)
    // 模拟加载引用数据
    loadSampleReferences(numPages)
  }

  // 加载示例引用数据
  const loadSampleReferences = (totalPages: number) => {
    const sampleRefs: PDFReference[] = [
      {
        id: 'ref-1',
        pageNumber: 1,
        content: '产品概述与架构设计',
        startY: 100,
        endY: 150,
        startX: 50,
        endX: 550,
        excerpt: '本文档详细介绍了产品的整体架构设计和核心功能模块...',
        createTime: new Date().toLocaleString()
      },
      {
        id: 'ref-2',
        pageNumber: 2,
        content: '技术选型与实现方案',
        startY: 80,
        endY: 120,
        startX: 50,
        endX: 550,
        excerpt: '前端采用React框架，后端使用Node.js和Express...',
        createTime: new Date().toLocaleString()
      },
      {
        id: 'ref-3',
        pageNumber: 3,
        content: '性能优化策略',
        startY: 120,
        endY: 180,
        startX: 50,
        endX: 550,
        excerpt: '本章节讨论了系统性能优化的关键策略和实践方法...',
        createTime: new Date().toLocaleString()
      }
    ]
    setReferences(sampleRefs)
  }

  // 跳转到指定页码
  const goToPage = (pageNum: number) => {
    if (pageNum >= 1 && pageNum <= (numPages || 1)) {
      setPageNumber(pageNum)
    }
  }

  // 处理引用点击，实现精确滚动定位
  const handleReferenceClick = (ref: PDFReference) => {
    setActiveReference(ref)
    setIsLoading(true)
    goToPage(ref.pageNumber)
    
    // 添加延迟确保页面已渲染
    setTimeout(() => {
      scrollToReference(ref)
      setIsLoading(false)
    }, 500)
  }

  // 精确滚动到引用位置
  const scrollToReference = (ref: PDFReference) => {
    if (pdfDisplayRef.current && pageRefs.current[ref.pageNumber - 1]) {
      const pageElement = pageRefs.current[ref.pageNumber - 1]
      if (pageElement) {
        const pageRect = pageElement.getBoundingClientRect()
        const viewerRect = pdfDisplayRef.current?.getBoundingClientRect()
        
        if (viewerRect) {
          // 计算要滚动的位置，使引用区域居中显示
          const scrollPosition = (
            pageElement.offsetTop + 
            ref.startY * scale - 
            viewerRect.height / 2 +
            (ref.endY - ref.startY) * scale / 2
          )
          
          pdfDisplayRef.current.scrollTo({
            top: scrollPosition,
            behavior: 'smooth'
          })
        }
      }
    }
  }

  // 处理PDF文本点击事件，创建新引用
  const handleTextClick = (event: React.MouseEvent, pageNumber: number) => {
    // 模拟创建新引用
    const newReference: PDFReference = {
      id: `ref-${Date.now()}`,
      pageNumber,
      content: '新创建的引用',
      startY: Math.floor(Math.random() * 300),
      endY: Math.floor(Math.random() * 200) + 300,
      startX: 50,
      endX: 550,
      excerpt: '用户从PDF页面创建的引用',
      createTime: new Date().toLocaleString()
    }
    
    setReferences(prev => [...prev, newReference])
    setActiveReference(newReference)
    
    // 显示提示信息
    alert(`已在第${pageNumber}页创建新引用`)
  }

  // 渲染引用列表
  const renderReferences = () => {
    return (
      <div className='references-panel'>
        <div className='panel-header'>
          <h3>引用列表</h3>
          <span className='count'>({references.length}个引用)</span>
        </div>
        <div className='references-list'>
          {references.length === 0 ? (
            <div className='empty-state'>
              <p>暂无引用数据</p>
              <p className='hint'>点击PDF页面可创建引用</p>
            </div>
          ) : (
            <ul>
              {references.map((ref) => (
                <li
                  key={ref.id}
                  className={`reference-item ${activeReference?.id === ref.id ? 'active' : ''}`}
                  onClick={() => handleReferenceClick(ref)}
                >
                  <div className='reference-header'>
                    <span className='page-number'>第{ref.pageNumber}页</span>
                    <span className='time'>{ref.createTime}</span>
                  </div>
                  <div className='reference-content'>
                    <h4>{ref.content}</h4>
                    <p className='excerpt'>{ref.excerpt}</p>
                  </div>
                  <button 
                    className='remove-btn'
                    onClick={(e) => {
                      e.stopPropagation()
                      removeReference(ref.id)
                    }}
                  >
                    删除
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    )
  }

  // 删除引用
  const removeReference = (refId: string) => {
    setReferences(prev => prev.filter(ref => ref.id !== refId))
    if (activeReference?.id === refId) {
      setActiveReference(null)
    }
  }

  // 渲染高亮区域
  const renderHighlight = () => {
    if (!activeReference || activeReference.pageNumber !== pageNumber) {
      return null
    }

    return (
      <div 
        className='highlight-area'
        style={{
          position: 'absolute',
          top: `${activeReference.startY}px`,
          left: `${activeReference.startX || 50}px`,
          right: `${activeReference.endX ? `calc(100% - ${activeReference.endX}px)` : '50px'}`,
          height: `${activeReference.endY - activeReference.startY}px`,
          backgroundColor: 'rgba(255, 255, 0, 0.3)',
          border: '2px solid #ffd700',
          borderRadius: '4px',
          pointerEvents: 'none',
          zIndex: 10,
          boxShadow: '0 0 10px rgba(255, 215, 0, 0.3)'
        }}
      >
        <div className='highlight-tooltip'>
          {activeReference.content}
        </div>
      </div>
    )
  }

  // 处理页面渲染完成后的回调
  const onPageLoadSuccess = () => {
    if (activeReference && activeReference.pageNumber === pageNumber) {
      scrollToReference(activeReference)
    }
  }

  // 清理页面引用
  useEffect(() => {
    return () => {
      pageRefs.current = []
    }
  }, [])

  return (
    <div className='pdf-viewer-container' ref={viewerRef}>
      <h2>PDF 查看器 - 引用溯源功能</h2>
      
      {/* 工具栏 */}
      <div className='toolbar'>
        <button onClick={() => goToPage(pageNumber - 1)} disabled={pageNumber <= 1}>
          上一页
        </button>
        <span>
          第 {pageNumber} 页，共 {numPages} 页
        </span>
        <button onClick={() => goToPage(pageNumber + 1)} disabled={pageNumber >= (numPages || 1)}>
          下一页
        </button>
        <div className='zoom-controls'>
          <button onClick={() => setScale(prev => Math.max(0.5, prev - 0.1))}>-</button>
          <span>{Math.round(scale * 100)}%</span>
          <button onClick={() => setScale(prev => Math.min(3, prev + 0.1))}>+</button>
        </div>
        {activeReference && (
          <button 
            className='clear-btn'
            onClick={() => setActiveReference(null)}
          >
            清除高亮
          </button>
        )}
      </div>

      <div className='pdf-content'>
        {/* 引用面板 */}
        {renderReferences()}
        
        {/* PDF 显示区域 */}
        <div className='pdf-display' ref={pdfDisplayRef}>
          {isLoading ? (
            <div className='loading'>
              <div className='spinner'></div>
              <p>正在加载PDF文档...</p>
            </div>
          ) : (
            <Document
              file={pdfUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={() => {
                setIsLoading(false)
                alert('PDF文档加载失败')
              }}
              className='pdf-document'
            >
              <Page
                pageNumber={pageNumber}
                scale={scale}
                className='pdf-page'
                canvasRef={(el:any) => {
                  if (el) {
                    pageRefs.current[pageNumber - 1] = el as unknown as HTMLDivElement
                  }
                }}
                onLoadSuccess={onPageLoadSuccess}
                onClick={(event:any) => handleTextClick(event, pageNumber)}
                renderTextLayer={true}
                renderAnnotationLayer={true}
              >
                {renderHighlight()}
              </Page>
            </Document>
          )}
        </div>
      </div>
    </div>
  )
}

export default PDFViewer