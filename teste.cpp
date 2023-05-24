#include <iostream>
#include <fstream>
#include <string>
#include <chrono>
#include <thread>
#include <curl/curl.h>
#include <random>

// Função para enviar os dados para o servidor HTTP
size_t sendData(void *ptr, size_t size, size_t count, void *stream)
{
    // Formate os dados como uma string e envie-os como o corpo da solicitação POST
    std::string dataStr = static_cast<char *>(ptr);

    CURL *curl = static_cast<CURL *>(stream);
    CURLcode res;
    std::string url = "http://localhost:3000/data";

    curl_easy_setopt(curl, CURLOPT_URL, url.c_str());
    curl_easy_setopt(curl, CURLOPT_POST, 1);
    curl_easy_setopt(curl, CURLOPT_POSTFIELDS, dataStr.c_str());

    res = curl_easy_perform(curl);

    if (res != CURLE_OK)
    {
        std::cerr << "Erro ao enviar os dados para o servidor: " << curl_easy_strerror(res) << std::endl;
    }

    return size * count;
}

int main()
{
    CURL *curl = curl_easy_init();

    if (curl)
    {
        std::random_device rd;
        std::mt19937 generator(rd());
        std::uniform_real_distribution<double> distribution(0.0, 100.0);

        for (int i = 0; i < 100; ++i)
        {
            double data = distribution(generator);

            std::string dataStr = std::to_string(data);
            sendData((void *)dataStr.c_str(), sizeof(char), dataStr.length(), curl);

            std::this_thread::sleep_for(std::chrono::milliseconds(100)); // Aguarde 100ms entre cada envio de dado
        }

        curl_easy_cleanup(curl);
    }

    return 0;
}
