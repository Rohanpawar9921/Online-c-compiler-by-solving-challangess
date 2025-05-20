FROM gcc:latest

# Create directory first
RUN mkdir /code && \
    useradd -m user && \
    chown -R user:user /code

WORKDIR /code
USER user 