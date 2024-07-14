###########
# Builder #
###########

FROM python:3.9.7-buster as builder

WORKDIR /usr/src/app

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN apt-get update && apt-get install -y postgresql gcc python3-dev musl-dev gettext g++

RUN pip install --upgrade pip
COPY . .

COPY ./requirements.txt .
RUN pip wheel --no-cache-dir --no-deps --wheel-dir /usr/src/app/wheels -r requirements.txt

#########
# FINAL #
#########

FROM python:3.9.7-buster

RUN mkdir -p /home/app

RUN addgroup --system app && adduser --system app && adduser app app

ENV HOME=/home/app
ENV APP_HOME=/home/app/web
RUN mkdir $APP_HOME
RUN mkdir $APP_HOME/staticfiles
RUN mkdir $APP_HOME/mediafiles
RUN mkdir $APP_HOME/docs
WORKDIR $APP_HOME

RUN apt-get update && apt-get install -y libpq-dev
COPY --from=builder /usr/src/app/wheels /wheels
COPY --from=builder /usr/src/app/requirements.txt .
RUN pip install --no-cache /wheels/*

COPY ./entrypoint.sh $APP_HOME

COPY . $APP_HOME

COPY ../docs /home/app/web/docs

RUN chown -R app:app $APP_HOME

USER app

CMD ["/home/app/web/entrypoint.sh"]