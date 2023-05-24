#include <iostream>
#include <fstream>
#include <string>
#include <chrono>
#include <thread>
#include <curl/curl.h>

// Função para enviar os dados para o servidor HTTP
void sendData(double data)
{
    CURL *curl;
    CURLcode res;
    std::string url = "http://localhost:3000/data";

    curl = curl_easy_init();
    if (curl)
    {
        curl_easy_setopt(curl, CURLOPT_URL, url.c_str());
        curl_easy_setopt(curl, CURLOPT_POST, 1);

        // Formate os dados como uma string e envie-os como o corpo da solicitação POST
        std::string dataStr = std::to_string(data);
        curl_easy_setopt(curl, CURLOPT_POSTFIELDS, dataStr.c_str());

        res = curl_easy_perform(curl);

        if (res != CURLE_OK)
        {
            std::cerr << "Erro ao enviar os dados para o servidor: " << curl_easy_strerror(res) << std::endl;
        }

        curl_easy_cleanup(curl);
    }
}

int main()
{
    // Gere 100 dados lineares por segundo
    double value = 0;
    double increment = 1;

    for (int i = 0; i < 100; i++)
    {
        // Envie o valor para o servidor HTTP
        sendData(value);

        // Aguarde 1 segundo antes de gerar o próximo valor
        std::this_thread::sleep_for(std::chrono::seconds(1));

        // Atualize o valor para o próximo ciclo
        value += increment;
    }

    return 0;
}