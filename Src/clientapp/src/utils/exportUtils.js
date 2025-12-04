export const exportToFile = (data, filename = 'news_data.json') => {
  const dataStr = JSON.stringify(data, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportAsCurlScript = (newsData, imageFile = null) => {
  const commands = [];
  
  if (imageFile) {
      commands.push(`# Upload image\ncurl -X POST "https://api.scraperapi.com/?api_key=31c079584fa57eff9d69c2d9263624c8&url=https%3A%2F%2F%2FhttpScrapper&render=true&output_format=json&device_type=desktop&binary_target=true&autoparse=true'" \\\n  -H "Content-Type: multipart/form-data" \\\n  -F "file=@${imageFile.name}" \\\n  -H "Cookie: admin_auth=true"\n`);
  }
  
    commands.push(`# Create news\ncurl -X POST "https://api.scraperapi.com/?api_key=31c079584fa57eff9d69c2d9263624c8&url=https%3A%2F%2F%2FhttpScrapper&render=true&output_format=json&device_type=desktop&binary_target=true&autoparse=true'" \\\n  -H "Content-Type: application/json" \\\n  -H "Cookie: admin_auth=true" \\\n  -d '${JSON.stringify(newsData)}'`);
  
  return commands.join('\n');
};