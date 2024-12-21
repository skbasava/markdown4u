FROM python:3.9

WORKDIR /app

# Install git and other necessary tools
RUN apt-get update && apt-get install -y \
    git \
    && rm -rf /var/lib/apt/lists/*

# Clone the MarkItDown repository
RUN git clone https://github.com/microsoft/markitdown.git

# Install MarkItDown dependencies
RUN pip install --no-cache-dir -r markitdown/requirements.txt

# Install Flask
RUN pip install --no-cache-dir Flask==2.0.1

COPY app.py .

CMD ["python", "app.py"]
