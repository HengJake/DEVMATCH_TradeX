import React, { useEffect, useRef } from 'react';

interface CandlestickChartProps {
  crypto: string;
  timeframe: string;
  chartType: string;
}

const CandlestickChart: React.FC<CandlestickChartProps> = ({ crypto, timeframe, chartType }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Clear canvas
    ctx.fillStyle = '#1F2937';
    ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

    // Generate sample candlestick data
    const data = generateSampleData(50);
    
    // Draw candlesticks
    drawCandlesticks(ctx, data, canvas.offsetWidth, canvas.offsetHeight);
    
    // Draw grid
    drawGrid(ctx, canvas.offsetWidth, canvas.offsetHeight);
    
    // Draw price labels
    drawPriceLabels(ctx, data, canvas.offsetWidth, canvas.offsetHeight);

  }, [crypto, timeframe, chartType]);

  const generateSampleData = (count: number) => {
    const data = [];
    let price = crypto === 'BTC' ? 42750 : crypto === 'ETH' ? 2645 : 95;
    
    for (let i = 0; i < count; i++) {
      const open = price;
      const close = open + (Math.random() - 0.5) * (price * 0.05);
      const high = Math.max(open, close) + Math.random() * (price * 0.02);
      const low = Math.min(open, close) - Math.random() * (price * 0.02);
      
      data.push({ open, high, low, close, time: i });
      price = close;
    }
    
    return data;
  };

  const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 1;
    
    // Vertical lines
    for (let i = 0; i <= 10; i++) {
      const x = (width / 10) * i;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    // Horizontal lines
    for (let i = 0; i <= 8; i++) {
      const y = (height / 8) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  };

  const drawCandlesticks = (ctx: CanvasRenderingContext2D, data: any[], width: number, height: number) => {
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    
    const candleWidth = chartWidth / data.length * 0.7;
    const prices = data.flatMap(d => [d.high, d.low]);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice;

    data.forEach((candle, index) => {
      const x = padding + (index * chartWidth / data.length);
      const bodyTop = padding + ((maxPrice - Math.max(candle.open, candle.close)) / priceRange) * chartHeight;
      const bodyBottom = padding + ((maxPrice - Math.min(candle.open, candle.close)) / priceRange) * chartHeight;
      const wickTop = padding + ((maxPrice - candle.high) / priceRange) * chartHeight;
      const wickBottom = padding + ((maxPrice - candle.low) / priceRange) * chartHeight;
      
      const isGreen = candle.close > candle.open;
      
      // Draw wick
      ctx.strokeStyle = isGreen ? '#10B981' : '#EF4444';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x + candleWidth / 2, wickTop);
      ctx.lineTo(x + candleWidth / 2, wickBottom);
      ctx.stroke();
      
      // Draw body
      ctx.fillStyle = isGreen ? '#10B981' : '#EF4444';
      ctx.fillRect(x, bodyTop, candleWidth, Math.max(bodyBottom - bodyTop, 1));
      
      if (!isGreen) {
        ctx.strokeStyle = '#EF4444';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, bodyTop, candleWidth, Math.max(bodyBottom - bodyTop, 1));
      }
    });
  };

  const drawPriceLabels = (ctx: CanvasRenderingContext2D, data: any[], width: number, height: number) => {
    const prices = data.flatMap(d => [d.high, d.low]);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    
    ctx.fillStyle = '#9CA3AF';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'right';
    
    for (let i = 0; i <= 5; i++) {
      const price = maxPrice - (maxPrice - minPrice) * (i / 5);
      const y = 40 + (height - 80) * (i / 5);
      ctx.fillText(price.toFixed(0), width - 10, y + 4);
    }
  };

  return (
    <div className="h-96 relative">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ width: '100%', height: '100%' }}
      />
      
      {/* Overlay for annotations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="w-full h-full relative">
          {/* Support/Resistance zones */}
          <div className="absolute top-1/3 left-0 right-0 h-8 bg-green-500/10 border-y border-green-500/30"></div>
          <div className="absolute top-1/4 left-0 right-0 h-8 bg-red-500/10 border-y border-red-500/30"></div>
        </div>
      </div>
    </div>
  );
};

export default CandlestickChart;